const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');
const auth = require('../middleware/auth');
const axios = require('axios');
const cheerio = require('cheerio');

// Helper function to fetch website favicon
const fetchFavicon = async (url) => {
    try {
        const parsedUrl = new URL(url);
        const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}`;

        // Try fetching the page to find favicon link
        try {
            const response = await axios.get(url, {
                timeout: 5000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            const $ = cheerio.load(response.data);

            // 1. Prioritize apple-touch-icon (usually high quality)
            let faviconLink = $('link[rel="apple-touch-icon"]').attr('href') ||
                $('link[rel="apple-touch-icon-precomposed"]').attr('href');

            // 2. Check for high-res icons if no apple-touch-icon
            if (!faviconLink) {
                // Find all icon links
                const icons = [];
                $('link[rel="icon"]').each((i, el) => {
                    icons.push({
                        href: $(el).attr('href'),
                        sizes: $(el).attr('sizes')
                    });
                });

                // Sort by size if available (simple heuristic looking for "192" or "180" etc)
                const highResIcon = icons.find(icon =>
                    icon.sizes && (icon.sizes.includes('192') || icon.sizes.includes('180') || icon.sizes.includes('152') || icon.sizes.includes('144'))
                );

                if (highResIcon) {
                    faviconLink = highResIcon.href;
                }
            }

            // 3. Fallback to Open Graph image if explicitly high quality is desired (often better than 16x16 favicon)
            if (!faviconLink) {
                faviconLink = $('meta[property="og:image"]').attr('content');
            }

            // 4. Standard fallback
            if (!faviconLink) {
                faviconLink = $('link[rel="icon"]').attr('href') ||
                    $('link[rel="shortcut icon"]').attr('href');
            }

            if (faviconLink) {
                // Handle relative URLs
                if (faviconLink.startsWith('http')) {
                    return faviconLink;
                } else if (faviconLink.startsWith('//')) {
                    return `${parsedUrl.protocol}${faviconLink}`;
                } else if (faviconLink.startsWith('/')) {
                    if (baseUrl.endsWith('/')) {
                        return `${baseUrl.slice(0, -1)}${faviconLink}`;
                    }
                    return `${baseUrl}${faviconLink}`;
                } else {
                    return `${baseUrl}/${faviconLink}`;
                }
            }
        } catch (error) {
            console.log('Could not parse HTML for favicon:', error.message);
        }

        // Only try the standard /favicon.ico fallback if we can't find anything else, 
        // but if it's likely to 404, we'll return null to let the frontend handle the fallback.
        // For now, let's keep the logic but move the fallback inside the try-catch of the baseUrl
        return `${baseUrl}/favicon.ico`;
    } catch (error) {
        console.error('Error fetching favicon:', error.message);
        return null;
    }
};

// GET all tools (public - only active for users, all for admin)
router.get('/', async (req, res) => {
    try {
        const query = req.query.admin === 'true' ? {} : { isActive: true };
        const tools = await Tool.find(query).sort({ order: 1, createdAt: -1 });
        res.json(tools);
    } catch (error) {
        console.error('Error fetching tools:', error);
        res.status(500).json({ message: 'Server error fetching tools' });
    }
});

// GET single tool by ID
router.get('/:id', async (req, res) => {
    try {
        const tool = await Tool.findById(req.params.id);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        res.json(tool);
    } catch (error) {
        console.error('Error fetching tool:', error);
        res.status(500).json({ message: 'Server error fetching tool' });
    }
});

// POST create new tool (admin only)
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, link, icon, order, isActive, tag } = req.body;

        // Validate required fields
        if (!title || !description || !link) {
            return res.status(400).json({
                message: 'Title, description, and link are required'
            });
        }

        // Fetch favicon from the website URL
        const faviconUrl = await fetchFavicon(link);

        // Calculate next order if not provided
        let toolOrder = order;
        if (toolOrder === undefined || toolOrder === null || toolOrder === '') {
            const lastTool = await Tool.findOne().sort({ order: -1 });
            toolOrder = lastTool && lastTool.order !== undefined ? lastTool.order + 1 : 1;
        }

        const newTool = new Tool({
            title,
            description,
            link,
            icon: icon || '/images/default-tool-icon.png',
            faviconUrl,
            order: toolOrder,
            isActive: isActive !== undefined ? isActive : true,
            tag: tag || 'Resource'
        });

        await newTool.save();
        res.status(201).json(newTool);
    } catch (error) {
        console.error('Error creating tool:', error);
        res.status(500).json({
            message: 'Server error creating tool',
            error: error.message
        });
    }
});

// PUT update tool (admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, description, link, icon, isActive, order, tag } = req.body;

        const tool = await Tool.findById(req.params.id);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }

        // Update fields
        if (title) tool.title = title;
        if (description) tool.description = description;
        if (link) {
            tool.link = link;
            // Re-fetch favicon if link changed
            const faviconUrl = await fetchFavicon(link);
            if (faviconUrl) tool.faviconUrl = faviconUrl;
        }
        if (icon !== undefined) tool.icon = icon;
        if (isActive !== undefined) tool.isActive = isActive;
        if (order !== undefined && order !== '') tool.order = order;
        if (tag) tool.tag = tag;

        await tool.save();
        res.json(tool);
    } catch (error) {
        console.error('Error updating tool:', error);
        res.status(500).json({ message: 'Server error updating tool' });
    }
});

// PATCH toggle tool status (admin only)
router.patch('/:id/toggle', auth, async (req, res) => {
    try {
        const tool = await Tool.findById(req.params.id);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }

        tool.isActive = !tool.isActive;
        await tool.save();

        res.json(tool);
    } catch (error) {
        console.error('Error toggling tool status:', error);
        res.status(500).json({ message: 'Server error toggling tool status' });
    }
});

// DELETE tool (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const tool = await Tool.findByIdAndDelete(req.params.id);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        res.json({ message: 'Tool deleted successfully' });
    } catch (error) {
        console.error('Error deleting tool:', error);
        res.status(500).json({ message: 'Server error deleting tool' });
    }
});

module.exports = router;

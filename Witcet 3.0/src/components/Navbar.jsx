import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { width } = useWindowDimensions();
    const isMobile = width < 992; // Bootstrap lg breakpoint

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'AKTU notes', path: '/notes' },
        { label: 'Quantums', path: '/quantums' },
        { label: 'Last 5Year PYQ', path: '/pyqs' },
        { label: 'Updates', path: '/updates' },
        { label: 'Contact', path: '/contact' },
    ];

    return (
        <View style={styles.navbar}>
            <View style={[styles.container, isMobile ? styles.containerMobile : styles.containerDesktop]}>
                <View style={[styles.headerRow, isMobile ? styles.headerRowMobile : styles.headerRowDesktop]}>
                    <TouchableOpacity onPress={() => navigate('/')}>
                        <Image
                            source={{ uri: '/images/Logo.png' }}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {isMobile && (
                        <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)} style={styles.menuButton}>
                            <Text style={styles.menuIcon}>☰</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {(!isMobile || isMenuOpen) && (
                    <View style={[styles.navContent, isMobile ? styles.navContentMobile : styles.navContentDesktop]}>
                        <View style={[styles.linksContainer, isMobile && styles.linksContainerMobile]}>
                            {navLinks.map((link) => (
                                <TouchableOpacity key={link.path} onPress={() => {
                                    navigate(link.path);
                                    setIsMenuOpen(false);
                                }} style={styles.linkItem}>
                                    <Text style={styles.linkText}>{link.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={[styles.searchContainer, isMobile && styles.searchContainerMobile]}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search title, tag, code..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onSubmitEditing={handleSearch}
                                placeholderTextColor="#6c757d"
                            />
                            <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                                <Text style={styles.searchButtonText}>Search</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: '#f8f9fa',
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 1000,
        position: 'sticky',
        top: 0,
        width: '100%',
    },
    container: {
        width: '100%',
        maxWidth: 1320,
        alignSelf: 'center',
        paddingHorizontal: 16,
    },
    containerDesktop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    containerMobile: {
        flexDirection: 'column',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerRowDesktop: {
        marginRight: 24, // Add spacing between logo and links
        flexShrink: 0,   // Prevent logo container from shrinking
    },
    headerRowMobile: {
        width: '100%',
        justifyContent: 'space-between',
    },
    logo: {
        height: 45,       // Slightly larger height
        width: 180,       // Increased width to fit logo text
    },
    menuButton: {
        padding: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        borderRadius: 4,
    },
    menuIcon: {
        fontSize: 24,
        color: 'rgba(0,0,0,0.5)',
    },
    navContent: {
        flex: 1,
    },
    navContentDesktop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    navContentMobile: {
        flexDirection: 'column',
        marginTop: 16,
        width: '100%',
    },
    linksContainer: {
        flexDirection: 'row',
    },
    linksContainerMobile: {
        flexDirection: 'column',
        marginBottom: 16,
    },
    linkItem: {
        paddingHorizontal: 12, // Reduced padding to fit more items
        paddingVertical: 8,
    },
    linkText: {
        fontSize: 16,
        color: '#475569', // text-secondary
        fontWeight: '500',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchContainerMobile: {
        width: '100%',
    },
    searchInput: {
        height: 40,
        borderColor: '#ced4da',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        marginRight: 8,
        width: 200,
        outlineStyle: 'none',
    },
    searchButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#198754',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
    searchButtonText: {
        color: '#198754',
        fontWeight: '500',
    }
});

export default Navigation;

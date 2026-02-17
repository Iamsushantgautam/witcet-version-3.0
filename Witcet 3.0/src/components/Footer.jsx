import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Platform, useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const handleLink = (url) => {
        if (url.startsWith('http')) {
            Linking.openURL(url);
        } else {
            navigate(url);
        }
    };

    return (
        <View style={styles.footer}>
            {/* Section: Social media */}
            <View style={styles.socialSection}>
                <View style={styles.container}>
                    <View style={[styles.socialContent, isMobile && styles.socialContentMobile]}>
                        <Text style={styles.socialText}>Get connected with us on social networks:</Text>
                        <View style={styles.socialIcons}>
                            <TouchableOpacity onPress={() => handleLink('https://www.youtube.com/@witcet')} style={styles.socialIcon}>
                                <i className="fab fa-youtube" style={{ color: 'white', fontSize: 18 }}></i>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleLink('https://www.instagram.com/wit_cet/')} style={styles.socialIcon}>
                                <i className="fab fa-instagram" style={{ color: 'white', fontSize: 18 }}></i>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            {/* Section: Links */}
            <View style={styles.linksSection}>
                <View style={styles.container}>
                    <View style={[styles.row, isMobile && styles.rowMobile]}>
                        {/* Column 1: Witcet */}
                        <View style={[styles.col, styles.colLarge, isMobile && styles.colMobile]}>
                            <Text style={styles.heading}>WITCET</Text>
                            <View style={[styles.divider, isMobile && styles.dividerMobile]} />
                            <Text style={styles.text}>
                                We offer expert guidance, interactive study materials, and practice tests to help you excel in exams.
                            </Text>
                        </View>

                        {/* Column 2: Products */}
                        <View style={[styles.col, isMobile && styles.colMobile]}>
                            <Text style={styles.heading}>PRODUCTS</Text>
                            <View style={[styles.divider, isMobile && styles.dividerMobile]} />
                            <TouchableOpacity onPress={() => handleLink('/notes')}><Text style={styles.link}>AKTU Notes</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => handleLink('/pyqs')}><Text style={styles.link}>B.Tech PYQs</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => handleLink('/quantums')}><Text style={styles.link}>Quantums</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => handleLink('/updates')}><Text style={styles.link}>Updates</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => handleLink('/tools')}><Text style={styles.link}>Tools</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => handleLink('/offers')}><Text style={styles.link}>Offers</Text></TouchableOpacity>
                        </View>

                        {/* Column 3: About */}
                        <View style={[styles.col, isMobile && styles.colMobile]}>
                            <Text style={styles.heading}>ABOUT</Text>
                            <View style={[styles.divider, isMobile && styles.dividerMobile]} />
                            <TouchableOpacity onPress={() => handleLink('/about')}><Text style={styles.link}>About Us</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => handleLink('/policy')}><Text style={styles.link}>Policy</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => handleLink('/feedback')}><Text style={styles.link}>Feedback</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => handleLink('/contact')}><Text style={styles.link}>Contact Us</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => handleLink('/help')}><Text style={styles.link}>Help</Text></TouchableOpacity>
                        </View>

                        {/* Column 4: Contact */}
                        <View style={[styles.col, styles.colLarge, isMobile && styles.colMobile]}>
                            <Text style={styles.heading}>CONTACT</Text>
                            <View style={[styles.divider, isMobile && styles.dividerMobile]} />
                            <TouchableOpacity
                                onPress={() => handleLink('https://t.me/+mKi_iF1EsEg2MDU1')}
                                style={[styles.telegramButton, isMobile && styles.telegramButtonMobile]}
                            >
                                <Text style={styles.telegramButtonText}>Join our Telegram Channel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            {/* Copyright */}
            <View style={styles.copyrightSection}>
                <Text style={styles.copyrightText}>
                    © 2025 Copyright: <Text style={styles.boldText} onPress={() => navigate('/')}>Witcet</Text>
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        backgroundColor: '#ECEFF1',
        marginTop: 48,
    },
    container: {
        width: '100%',
        maxWidth: 1320,
        alignSelf: 'center',
        paddingHorizontal: 16,
    },
    socialSection: {
        backgroundColor: '#00BFFF',
        paddingVertical: 16,
    },
    socialContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    socialContentMobile: {
        flexDirection: 'column',
        gap: 12,
        alignItems: 'center',
        textAlign: 'center',
    },
    socialText: {
        color: 'white',
        fontSize: 16,
    },
    socialIcons: {
        flexDirection: 'row',
    },
    socialIcon: {
        marginLeft: 16,
    },
    linksSection: {
        paddingVertical: 40,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -12,
    },
    rowMobile: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    col: {
        width: '16.66%', // Approx col-2
        paddingHorizontal: 12,
        marginBottom: 24,
        minWidth: 150,
        flexGrow: 1,
    },
    colMobile: {
        width: '100%',
        alignItems: 'center',
        textAlign: 'center',
    },
    colLarge: {
        width: '25%', // Approx col-3 or col-4
        minWidth: 250,
    },
    heading: {
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 8,
        color: '#212529',
    },
    divider: {
        width: 60,
        height: 2,
        backgroundColor: '#7c4dff',
        marginBottom: 16,
    },
    dividerMobile: {
        alignSelf: 'center',
    },
    text: {
        color: '#4f4f4f',
        marginBottom: 16,
        lineHeight: 24,
    },
    link: {
        color: '#212529',
        marginBottom: 12,
        textDecorationLine: 'none',
    },
    telegramButton: {
        backgroundColor: '#0d6efd',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 50,
        alignSelf: 'flex-start',
    },
    telegramButtonMobile: {
        alignSelf: 'center',
    },
    telegramButtonText: {
        color: 'white',
        fontWeight: '500',
    },
    copyrightSection: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        padding: 16,
        alignItems: 'center',
    },
    copyrightText: {
        color: '#212529',
        fontSize: 14,
    },
    boldText: {
        fontWeight: 'bold',
    }
});

export default Footer;

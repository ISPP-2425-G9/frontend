import { GlobalStyles } from '@/constants/Colors';
import useAuth from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import CustomButton from './CustomButton';
import CustomModal from './CustomModal';
import { ThemedText } from './ThemedText';

const CustomNavbar = () => {
    const navigation = useNavigation();
    const currentRoute = useNavigationState(
        (state) => state?.routes?.[state.index]?.name || ''
    );
    const { width } = useWindowDimensions();
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
    const [activeItem, setActiveItem] = useState<string>('');
    const isNarrow = width < 450;
    const { isAuthenticated, roles, name } = useAuth();
    let userRoles: string[] | null = null;
    let userName: string | null = null;
    if (isAuthenticated) {
        userRoles = roles;
        userName = name;
    }

    useEffect(() => {
        if (currentRoute) setActiveItem(currentRoute);
    }, [currentRoute]);

    const handleLogout = () => {
        try {
            AsyncStorage.clear();
            navigation.navigate('home' as never);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
        setIsLogoutModalVisible(false);
    };

    const handleNavigation = (route: string) => {
        setActiveItem(route);
        navigation.navigate(route as never);
        setMenuOpen(false);
    };

    return (
        <View style={styles.navbar}>
            <TouchableOpacity onPress={() => { setActiveItem('home'); navigation.navigate('home' as never) }}>
                <Image
                    source={require("@/assets/images/icon_caronte_azul.png")}
                    style={styles.logo}
                />
            </TouchableOpacity>
            {
                isNarrow ? (
                    <View>
                        <TouchableOpacity onPress={() => { setMenuOpen(!menuOpen); }}>                            <Ionicons name="menu" size={28} color="#333" />
                        </TouchableOpacity>
                        {menuOpen && (
                            <View style={styles.dropdown}>
                                <TouchableOpacity onPress={() => { handleNavigation('certificate/index'); setMenuOpen(false); }}>
                                    <Text style={styles.dropdownNavItem}>Cargar certificado</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { handleNavigation('about/index'); setMenuOpen(false); }}>
                                    <Text style={styles.dropdownNavItem}>Sobre nosotros</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { handleNavigation('contact/index'); setMenuOpen(false); }}>
                                    <Text style={styles.dropdownNavItem}>Contáctanos</Text>
                                </TouchableOpacity>
                                {!isAuthenticated && (
                                    <>
                                        <TouchableOpacity onPress={() => { handleNavigation('login/index'); setMenuOpen(false); }}>
                                            <Text style={styles.dropdownNavItem}>Iniciar sesión</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { handleNavigation('register/index'); setMenuOpen(false); }}>
                                            <Text style={styles.dropdownNavItem}>Registrarse</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                                {isAuthenticated && userRoles?.includes("ADMIN") && (
                                    <>
                                        <TouchableOpacity onPress={() => { handleNavigation('admin/listUsers'); setMenuOpen(false); }}>
                                            <Text style={styles.dropdownNavItem}>Usuarios</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            setUserMenuOpen(false);
                                            setIsLogoutModalVisible(true);
                                        }}>
                                            <Text style={styles.dropdownNavItem}>Cerrar sesión</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                                {isAuthenticated && userRoles?.includes("CUSTOMER") && (
                                    <>
                                        <TouchableOpacity onPress={() => { handleNavigation('obituaries/index'); setMenuOpen(false); }}>
                                            <Text style={styles.dropdownNavItem}>Esquelas</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                                {isAuthenticated && userRoles?.includes("CUSTOMER_PREMIUM") && (
                                    <>
                                        <TouchableOpacity onPress={() => { handleNavigation('messages/listMyMessages'); setMenuOpen(false); }}>
                                            <Text style={styles.dropdownNavItem}>Mensajes</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { handleNavigation('contacts/index'); setMenuOpen(false); }}>
                                            <Text style={styles.dropdownNavItem}>Contactos</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                                {isAuthenticated && (userRoles?.includes("CUSTOMER") || userRoles?.includes("COMPANY")) && (
                                    <>
                                        <TouchableOpacity onPress={() => { handleNavigation('services/index'); setMenuOpen(false); }}>
                                            <Text style={styles.dropdownNavItem}>Servicios</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { handleNavigation('subscribe/index'); setMenuOpen(false); }}>
                                            <Text style={styles.dropdownNavItem}>Planes</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            setUserMenuOpen(false);
                                            handleNavigation('profile/index');
                                            setMenuOpen(false);
                                        }}>
                                            <Text style={styles.dropdownNavItem}>{userName}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            setUserMenuOpen(false);
                                            setIsLogoutModalVisible(true);
                                        }}>
                                            <Text style={styles.dropdownNavItem}>Cerrar sesión</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        )}
                    </View>
                ) : (
                    <React.Fragment>
                        <View style={styles.navItems}>
                            <TouchableOpacity onPress={() => {handleNavigation('certificate/index')}}>
                                <View>
                                    <Text style={styles.navItem}>Cargar certificado</Text>
                                    {activeItem === 'certificate/index' && <View style={styles.activeIndicator} />}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {handleNavigation('about/index')}}>
                                 <View>
                                    <Text style={styles.navItem}>Sobre nosotros</Text>
                                    {activeItem === 'about/index' && <View style={styles.activeIndicator} />}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {handleNavigation('contact/index')}}>
                                <View>
                                    <Text style={styles.navItem}>Contáctanos</Text>
                                    {activeItem === 'contact/index' && <View style={styles.activeIndicator} />}
                                </View>
                            </TouchableOpacity>
                            {!isAuthenticated && (
                                <>
                                    <TouchableOpacity onPress={() => {handleNavigation('login/index')}}>
                                        <View>
                                            <Text style={styles.navItem}>Iniciar sesión</Text>
                                            {activeItem === 'login/index' && <View style={styles.activeIndicator} />}
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {handleNavigation('register/index')}}>
                                        <View>
                                            <Text style={styles.navItem}>Registrarse</Text>
                                            {activeItem === 'register/index' && <View style={styles.activeIndicator} />}
                                        </View>
                                    </TouchableOpacity>
                                </>
                            )}
                            {isAuthenticated && userRoles?.includes("ADMIN") && (
                                <>
                                    <TouchableOpacity onPress={() => {handleNavigation('admin/listUsers')}}>
                                        <View>
                                            <Text style={styles.navItem}>Usuarios</Text>
                                            {activeItem === 'admin/listUsers' && <View style={styles.activeIndicator} />}
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        setUserMenuOpen(false);
                                        setIsLogoutModalVisible(true);
                                    }}>
                                        <View>
                                            <Text style={styles.navItem}>Cerrar sesión</Text>
                                        </View>
                                    </TouchableOpacity>
                                </>
                            )}
                            {isAuthenticated && userRoles?.includes("CUSTOMER") && (
                                <>
                                    <TouchableOpacity onPress={() => {handleNavigation('obituaries/index')}}>
                                        <View>
                                            <Text style={styles.navItem}>Esquelas</Text>
                                            {activeItem === 'obituaries/index' && <View style={styles.activeIndicator} />}
                                        </View>
                                    </TouchableOpacity>
                                </>
                            )}
                            {isAuthenticated && userRoles?.includes("CUSTOMER_PREMIUM") && (
                                <>
                                    <TouchableOpacity onPress={() => {handleNavigation('messages/listMyMessages')}}>
                                        <View>
                                            <Text style={styles.navItem}>Mensajes</Text>
                                            {activeItem === 'messages/listMyMessages' && <View style={styles.activeIndicator} />}
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {handleNavigation('contacts/index')}}>
                                        <View>
                                            <Text style={styles.navItem}>Contactos</Text>
                                            {activeItem === 'contacts/index' && <View style={styles.activeIndicator} />}
                                        </View>
                                    </TouchableOpacity>
                                </>
                            )}
                            {isAuthenticated && (userRoles?.includes("CUSTOMER") || userRoles?.includes("COMPANY")) && (
                                <>
                                    <TouchableOpacity onPress={() => {handleNavigation('services/index')}}>
                                        <View>
                                            <Text style={styles.navItem}>Servicios</Text>
                                            {activeItem === 'services/index' && <View style={styles.activeIndicator} />}
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {handleNavigation('subscribe/index')}}>
                                        <View>
                                            <Text style={styles.navItem}>Planes</Text>
                                            {activeItem === 'subscribe/index' && <View style={styles.activeIndicator} />}
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {setUserMenuOpen(!userMenuOpen)}}>
                                        <View>
                                            <Text style={styles.navItem}>{userName}</Text>
                                            {activeItem === 'profile/index' && <View style={styles.activeIndicator} />}
                                        </View>
                                    </TouchableOpacity>
                                    {userMenuOpen && (
                                        <View style={styles.dropdown}>
                                            <TouchableOpacity onPress={() => {
                                                setUserMenuOpen(false);
                                                handleNavigation('profile/index');
                                            }}>
                                                <Text style={styles.dropdownNavItem}>Mi perfil</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => {
                                                setUserMenuOpen(false);
                                                setIsLogoutModalVisible(true);
                                            }}>
                                                <Text style={styles.dropdownNavItem}>Cerrar sesión</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </>
                            )}
                        </View>
                    </React.Fragment>
                )
            }
            <CustomModal
                visible={isLogoutModalVisible}
                onClose={() => {setIsLogoutModalVisible(false)}}
                title="Cerrar sesión"
                style={styles.modalContent}
            >
                <View style={styles.modalContent}>
                    <ThemedText style={styles.modalText}>
                        ¿Estás seguro que deseas cerrar sesión?
                    </ThemedText>
                    <View style={styles.modalButtons}>
                        <CustomButton
                            title="Cancelar"
                            onPress={() => {setIsLogoutModalVisible(false)}}
                            style={styles.modalButton}
                            color="red"
                        />
                        <CustomButton
                            title="Confirmar"
                            onPress={handleLogout}
                            style={styles.modalButton}
                            color="blue"
                        />
                    </View>
                </View>
            </CustomModal>
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        paddingVertical: 10,
        paddingHorizontal: 15,
        height: 60,
        zIndex: 10,
        position: 'relative',
        overflow: 'visible',
    },
    logo: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    navItems: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    navItem: {
        fontSize: 16,
        color: GlobalStyles.blue,
        fontFamily: GlobalStyles.font,
        marginHorizontal: 10,
    },
    activeIndicator: {
        borderBottomWidth: 2,
        borderBottomColor: GlobalStyles.blue,
        marginTop: 2,
        borderRadius: 10,
    },
    dropdown: {
        position: 'absolute',
        top: 60,
        right: 15,
        backgroundColor: '#f8f8f8',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        zIndex: 10,
        elevation: 10,
    },
    dropdownNavItem: {
        fontSize: 16,
        color: GlobalStyles.blue,
        fontFamily: GlobalStyles.font,
        width: 200,
        marginHorizontal: 10,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: GlobalStyles.lightGrey,
    },
    modalContent: {
        width: 'auto',
        padding: '2%',
    },
    modalText: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        marginHorizontal: 5,
    },
});

export default CustomNavbar;
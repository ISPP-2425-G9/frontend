import useAuth from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import CustomButton from './CustomButton';
import CustomModal from './CustomModal';
import { ThemedText } from './ThemedText';

const CustomNavbar = () => {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
    const isNarrow = width < 500;
    const { isAuthenticated, roles, name } = useAuth();
    console.log(useAuth());
    let userRoles: string[] | null = null;
    let userName: string | null = null;
    if (isAuthenticated) {
        userRoles = roles;
        userName = name;
    }

    const handleNavigation = (route: string) => {
        navigation.navigate(route as never);
        setMenuOpen(false);
    };

    const handleLogout = () => {
        try {
            AsyncStorage.clear();
            navigation.navigate('home' as never);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
        setIsLogoutModalVisible(false);
    };

    return (
        <View style={styles.navbar}>
            <TouchableOpacity onPress={() => navigation.navigate('home' as never)}>
                <Image
                    source={require("@/assets/images/icon_caronte_azul.png")}
                    style={styles.logo}
                />
            </TouchableOpacity>
            {
                isNarrow ? (
                    <View>
                        <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
                            <Ionicons name="menu" size={28} color="#333" />
                        </TouchableOpacity>
                        {menuOpen && (
                            <View style={styles.dropdown}>
                                <TouchableOpacity onPress={() => navigation.navigate('certificate/index' as never)}>
                                    <Text style={styles.navItem}>Cargar Certificado</Text>
                                </TouchableOpacity>
                                {!isAuthenticated && (
                                    <>
                                        <TouchableOpacity onPress={() => navigation.navigate('login/index' as never)}>
                                            <Text style={styles.navItem}>Iniciar sesión</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => navigation.navigate('register/index' as never)}>
                                            <Text style={styles.navItem}>Registrarse</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                                {isAuthenticated && userRoles?.includes("ADMIN") && (
                                    <>
                                        <TouchableOpacity onPress={() => navigation.navigate('admin/listUsers' as never)}>
                                            <Text style={styles.navItem}>Usuarios</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            setUserMenuOpen(false);
                                            setIsLogoutModalVisible(true);
                                        }}>
                                            <Text style={styles.navItem}>Cerrar sesión</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                                {isAuthenticated && userRoles?.includes("CUSTOMER") && (
                                    <>
                                        <TouchableOpacity onPress={() => navigation.navigate('obituaries/index' as never)}>
                                            <Text style={styles.navItem}>Esquelas</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                                {isAuthenticated && userRoles?.includes("CUSTOMER_PREMIUM") && (
                                    <>
                                        <TouchableOpacity onPress={() => navigation.navigate('messages/index' as never)}>
                                            <Text style={styles.navItem}>Mensajes</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => navigation.navigate('contacts/index' as never)}>
                                            <Text style={styles.navItem}>Contactos</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                                {isAuthenticated && (userRoles?.includes("CUSTOMER") || userRoles?.includes("COMPANY")) && (
                                    <>
                                        <TouchableOpacity onPress={() => navigation.navigate('services/index' as never)}>
                                            <Text style={styles.navItem}>Servicios</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => navigation.navigate('subscribe/index' as never)}>
                                            <Text style={styles.navItem}>Suscribirse</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setUserMenuOpen(!userMenuOpen)}>
                                            <Text style={styles.navItem}>{userName}</Text>
                                        </TouchableOpacity>
                                        {userMenuOpen && (
                                            <View style={styles.dropdown}>
                                                <TouchableOpacity onPress={() => {
                                                    setUserMenuOpen(false);
                                                    navigation.navigate('profile/index' as never);
                                                }}>
                                                    <Text style={styles.navItem}>Mi Perfil</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => {
                                                    setUserMenuOpen(false);
                                                    setIsLogoutModalVisible(true);
                                                }}>
                                                    <Text style={styles.navItem}>Cerrar sesión</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </>
                                )}
                            </View>
                        )}
                    </View>
                ) : (
                    <React.Fragment>
                        <View style={styles.navItems}>
                            <TouchableOpacity onPress={() => navigation.navigate('certificate/index' as never)}>
                                <Text style={styles.navItem}>Cargar Certificado</Text>
                            </TouchableOpacity>
                            {!isAuthenticated && (
                                <>
                                    <TouchableOpacity onPress={() => navigation.navigate('login/index' as never)}>
                                        <Text style={styles.navItem}>Iniciar sesión</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.navigate('register/index' as never)}>
                                        <Text style={styles.navItem}>Registrarse</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                            {isAuthenticated && userRoles?.includes("ADMIN") && (
                                <>
                                    <TouchableOpacity onPress={() => navigation.navigate('admin/listUsers' as never)}>
                                        <Text style={styles.navItem}>Usuarios</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        setUserMenuOpen(false);
                                        setIsLogoutModalVisible(true);
                                    }}>
                                        <Text style={styles.navItem}>Cerrar sesión</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                            {isAuthenticated && userRoles?.includes("CUSTOMER") && (
                                <>
                                    <TouchableOpacity onPress={() => navigation.navigate('obituaries/index' as never)}>
                                        <Text style={styles.navItem}>Esquelas</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                            {isAuthenticated && userRoles?.includes("CUSTOMER_PREMIUM") && (
                                <>
                                    <TouchableOpacity onPress={() => navigation.navigate('messages/index' as never)}>
                                        <Text style={styles.navItem}>Mensajes</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.navigate('contacts/index' as never)}>
                                        <Text style={styles.navItem}>Contactos</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                            {isAuthenticated && (userRoles?.includes("CUSTOMER") || userRoles?.includes("COMPANY")) && (
                                <>
                                    <TouchableOpacity onPress={() => navigation.navigate('services/index' as never)}>
                                        <Text style={styles.navItem}>Servicios</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.navigate('subscribe/index' as never)}>
                                        <Text style={styles.navItem}>Suscribirse</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setUserMenuOpen(!userMenuOpen)}>
                                        <Text style={styles.navItem}>{userName}</Text>
                                    </TouchableOpacity>
                                    {userMenuOpen && (
                                        <View style={styles.dropdown}>
                                            <TouchableOpacity onPress={() => {
                                                setUserMenuOpen(false);
                                                navigation.navigate('profile/index' as never);
                                            }}>
                                                <Text style={styles.navItem}>Mi Perfil</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => {
                                                setUserMenuOpen(false);
                                                setIsLogoutModalVisible(true);
                                            }}>
                                                <Text style={styles.navItem}>Cerrar sesión</Text>
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
                onClose={() => setIsLogoutModalVisible(false)}
                title="Cerrar sesión"
            >
                <View style={styles.modalContent}>
                    <ThemedText style={styles.modalText}>
                        ¿Estás seguro que deseas cerrar sesión?
                    </ThemedText>
                    <View style={styles.modalButtons}>
                        <CustomButton
                            title="Cancelar"
                            onPress={() => setIsLogoutModalVisible(false)}
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
        color: '#333',
        marginHorizontal: 10,
    },
    dropdown: {
        position: 'absolute',
        top: 60,
        right: 15,
        backgroundColor: '#f8f8f8',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        zIndex: 10,      // Para iOS
        elevation: 10,   // Para Android
    },
    modalContent: {
        padding: 20,
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
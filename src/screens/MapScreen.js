import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, PanResponder, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const MapScreen = () => {
    const navigation = useNavigation();
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
    const [initialDistance, setInitialDistance] = useState(0);

    const handleResetMap = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
        setLastPosition({ x: 0, y: 0 });
    };

    const panResponder = useState(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            
            onPanResponderGrant: (evt) => {
                if (evt.nativeEvent.touches.length === 2) {
                    const [touch1, touch2] = evt.nativeEvent.touches;
                    const dx = Math.abs(touch1.pageX - touch2.pageX);
                    const dy = Math.abs(touch1.pageY - touch2.pageY);
                    setInitialDistance(Math.sqrt(dx * dx + dy * dy));
                } else {
                    setLastPosition(position);
                }
            },

            onPanResponderMove: (evt, gestureState) => {
                if (evt.nativeEvent.touches.length === 2) {
                    const [touch1, touch2] = evt.nativeEvent.touches;
                    const dx = Math.abs(touch1.pageX - touch2.pageX);
                    const dy = Math.abs(touch1.pageY - touch2.pageY);
                    const currentDistance = Math.sqrt(dx * dx + dy * dy);

                    if (initialDistance > 0) {
                        const newScale = (currentDistance / initialDistance) * scale;
                        if (newScale >= 0.5 && newScale <= 3) {
                            setScale(newScale);
                        }
                    }
                } else if (evt.nativeEvent.touches.length === 1) {
                    const newX = lastPosition.x + gestureState.dx;
                    const newY = lastPosition.y + gestureState.dy;
                    setPosition({ x: newX, y: newY });
                }
            },

            onPanResponderRelease: () => {
                setLastPosition(position);
                setInitialDistance(0);
            },
        }),
    )[0];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* ✅ 1. Map Container แสดงผลเต็มหน้าจอ */}
                <View style={StyleSheet.absoluteFillObject} {...panResponder.panHandlers}>
                    <Image
                        source={require('../../assets/m1.png')}
                        style={{
                            width: '100%',
                            height: '100%',
                            transform: [
                                { scale: scale },
                                { translateX: position.x / scale },
                                { translateY: position.y / scale }
                            ]
                        }}
                        resizeMode="contain"
                    />
                </View>

                {/* ✅ 2. ย้าย Header และปุ่มต่างๆ มา "ลอย" อยู่ข้างบน */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={32} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.title}>แผนที่โรงแรม</Text>
                    <View style={{ width: 40 }} /> 
                </View>
                
                <View style={styles.footer}>
                     <TouchableOpacity style={styles.resetButton} onPress={handleResetMap}>
                        <Ionicons name="refresh" size={24} color="#fff" />
                        <Text style={styles.resetButtonText}>รีเซ็ต</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
};

// ✅ 3. แก้ไข Stylesheet ใหม่ทั้งหมด
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    backButton: {
        padding: 5,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        alignItems: 'center',
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    resetButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
});

export default MapScreen;

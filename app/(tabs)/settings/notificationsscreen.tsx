import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, SafeAreaView, View, Switch } from 'react-native';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@/constants/Colors';
import CustomPopup from '@/components/CustomPopup'; // CustomPopup'u import et

// Bildirimlerin nasıl görüneceğini yapılandırın
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const NotificationsScreen = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [dailyReminderEnabled, setDailyReminderEnabled] = useState(false);
    const [reminderTime, setReminderTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [popupVisible, setPopupVisible] = useState(false); // CustomPopup için state

    useEffect(() => {
        const getPermissions = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                console.warn('Notification permissions not granted!');
            }
        };
        getPermissions();
    }, []);

    // Bildirim gönderme işlevi
    const sendNotification = async () => {
        if (!notificationsEnabled) {
            setPopupVisible(true); // CustomPopup'u göster
            return; // Bildirimler devre dışı bırakıldığında çık
        }
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Test Notification',
                body: 'This is a test notification from Expo!',
                data: { data: 'test' },
            },
            trigger: null,
        });
    };

    // Günlük Hatırlatıcıyı Zamanla
    const scheduleDailyReminder = async () => {
        if (dailyReminderEnabled) {
            await Notifications.cancelAllScheduledNotificationsAsync();
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Daily Reminder',
                    body: 'This is your daily reminder!',
                    data: { data: 'reminder' },
                },
                trigger: {
                    hour: reminderTime.getHours(),
                    minute: reminderTime.getMinutes(),
                    repeats: true,
                },
            });
        } else {
            await Notifications.cancelAllScheduledNotificationsAsync();
        }
    };

    useEffect(() => {
        scheduleDailyReminder();
    }, [dailyReminderEnabled, reminderTime]);

    return (
        <SafeAreaView style={styles.container}>
            {/* Bildirim Ayarları */}
            <View style={styles.settingRow}>
                <Text style={styles.text}>Enable Notifications</Text>
                <Switch
                    value={notificationsEnabled}
                    onValueChange={(value) => setNotificationsEnabled(value)}
                />
            </View>

            {/* Günlük Hatırlatıcı */}
            <View style={styles.settingRow}>
                <Text style={styles.text}>Daily Reminder</Text>
                <Switch
                    value={dailyReminderEnabled}
                    onValueChange={(value) => setDailyReminderEnabled(value)}
                    disabled={!notificationsEnabled} // Bildirimler devre dışıysa hatırlatıcıyı devre dışı bırak
                />
            </View>

            {/* Hatırlatma Saati Seçimi */}
            {dailyReminderEnabled && (
                <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setShowTimePicker(true)}
                >
                    <Text style={styles.text}>
                        Reminder Time: {reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </TouchableOpacity>
            )}

            {showTimePicker && (
                <DateTimePicker
                    value={reminderTime}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => {
                        setShowTimePicker(false);
                        if (selectedTime) {
                            setReminderTime(selectedTime);
                        }
                    }}
                />
            )}

            {/* Test Butonu */}
            <TouchableOpacity style={styles.testButton} onPress={sendNotification}>
                <Text style={styles.text}>Test Notification</Text>
            </TouchableOpacity>

            {/* CustomPopup */}
            <CustomPopup
                visible={popupVisible}
                message="Please enable notifications to use this feature."
                onClose={() => setPopupVisible(false)}
            />
        </SafeAreaView>
    );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginVertical: 10,
    },
    text: {
        color: Colors.dark.text,
        fontSize: 18,
    },
    timePickerButton: {
        backgroundColor: Colors.dark.surfaceItems,
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    testButton: {
        paddingVertical: 10,
        backgroundColor: Colors.dark.accent,
        borderRadius: 5,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
});

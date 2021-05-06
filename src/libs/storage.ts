import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { format } from 'date-fns';

export interface PlantProps {
    id: string,
    name: string,
    about: string,
    water_tips: string,
    photo: string,
    environments: [string],
    frequency: {
        times: number,
        repeat_every: string
    },
    hour: string,
    date_time_notification: Date
}

export interface PlantPropsStorage {
    [id: string]: {
        data: PlantProps,
        notificationId: string
    }
}

export async function savePlant(plant: PlantProps): Promise<void> {
    try {
        const seconds = calculateScheduleTimeInSeconds(plant);
        const notificationId = scheduleNotification(plant, seconds);

        const data = await AsyncStorage.getItem('@plantmanager:plants');
        const oldPlantsData = data ? (JSON.parse(data) as PlantPropsStorage) : {};

        const newPlantsData = {
            [plant.id]: {
                data: plant,
                notificationId
            }
        }

        await AsyncStorage.setItem(
            '@plantmanager:plants',
            JSON.stringify({
                ...newPlantsData,
                ...oldPlantsData
            })
        );
    }
    catch (error) {
        throw new Error(error);
    }    
}

function calculateScheduleTimeInSeconds(plant: PlantProps): number {
    const nextWaterTime = new Date(plant.date_time_notification);
    const now = new  Date();

    const { times, repeat_every } = plant.frequency;

    if (repeat_every === 'week') {
        const interval = Math.trunc(7 / times);
        nextWaterTime.setDate(now.getDate() + interval);
    }
    else {
        nextWaterTime.setDate(now.getDate() + 1);
    }

    const seconds = Math.abs(
        Math.ceil(now.getTime() - nextWaterTime.getTime()) / 1000
    );

    return seconds;
}

async function scheduleNotification(
        plant: PlantProps, 
        scheduleTimeInSeconds: number
    ): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Heeey!',
            body: `Está na hora de cuidar da sua ${plant.name}! 🌱`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
            data: { plant }
        },
        trigger: {
            seconds: scheduleTimeInSeconds < 60 ? 60 : scheduleTimeInSeconds,
            repeats: true
        }
    });

    return notificationId;
}

export async function removePlant(plantId: string) {
    const data = await AsyncStorage.getItem('@plantmanager:plants');
    const plants = data ? (JSON.parse(data) as PlantPropsStorage) : { };

    await Notifications.cancelScheduledNotificationAsync(plants[plantId].notificationId)
    delete plants[plantId];

    await AsyncStorage.setItem(
        '@plantmanager:plants',
        JSON.stringify(plants)
    );
}

export async function loadPlants(): Promise<PlantProps[]> {
    try {
        const data = await AsyncStorage.getItem('@plantmanager:plants');
        const plants = data ? (JSON.parse(data) as PlantPropsStorage) : {};

        const sortedPlants = Object
            .keys(plants)
            .map((plant) => {
                return {
                    ...plants[plant].data,
                    hour: format(
                        new Date(plants[plant].data.date_time_notification),
                        'HH:mm'
                    )
                }
            })
            .sort((a, b) => 
                Math.floor(
                    new Date(a.date_time_notification).getTime() / 1000
                    - Math.floor(new Date(b.date_time_notification).getTime() / 1000)
                )
            )

        return sortedPlants;
    }
    catch (error) {
        throw new Error(error);
    }
}
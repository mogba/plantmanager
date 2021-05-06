import React from 'react';
import AppLoading from "expo-app-loading";

// Não é necessário informar './src/routes/index'
// porque de forma padrão o index é procurado
// quando nenhum arquivo é informado
import Routes from './src/routes';

import { 
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold
} from '@expo-google-fonts/jost'

export default function App() {
  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  });

  // useEffect(() => {
  //   // Código abaixo serve para observar o recebimento de notificações
  //   // const subscription = Notifications.addNotificationReceivedListener(
  //   //   async notification => {
  //   //     const data = notification.request.content.data.plant as PlantProps;
  //   //     console.log(data);
  //   //   }
  //   // );

  //   // return () => subscription.remove();

  //   async function notifications() {
  //     // Código abaixo serve para cancelar todas as notificações agendadas
  //     await Notifications.cancelAllScheduledNotificationsAsync();

  //     // Código abaixo serve para mostrar todas as notificações agendadas
  //     const data = await Notifications.getAllScheduledNotificationsAsync();
  //     console.log('######## NOTIFICAÇÕES AGENDADAS ########');
  //     console.log(data);
  //   }

  //   notifications();
  // });

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <Routes />
  );
}

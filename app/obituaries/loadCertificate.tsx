import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';

type RootStackParamList = {
    'obituaries/loadCertificate': { jsonData: string };
};

export default function LoadCertificate() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'obituaries/loadCertificate'>>();

    return (
        <div>
            Aquí se cargará el certificado de defunción
        </div>
    );
}

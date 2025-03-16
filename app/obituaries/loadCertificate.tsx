import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { AUTHORITIES } from '../_util/Authorities';
import { withAuth } from '../_util/withAuth';

type RootStackParamList = {
    'obituaries/loadCertificate': { jsonData: string };
};

function LoadCertificate() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'obituaries/loadCertificate'>>();

    return (
        <div>
            Aquí se cargará el certificado de defunción
        </div>
    );
}

export default withAuth(LoadCertificate, [AUTHORITIES.CUSTOMER])
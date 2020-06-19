import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "./src/containers/HomeScreen";
import LogIn from "./src/components/LogIn";
import BasicInfo from "./src/components/BasicInfo";
import BasicInfo0 from "./src/containers/BasicInfo0";
import AdditionalInfo from "./src/containers/AdditionalInfo";
import UploadPhoto from "./src/components/UploadPhoto";
import Membership from "./src/components/Membership";
//import Payment from './src/screens/Payment';
import Payment1 from "./src/components/Payment1";
import Confirmation from "./src/components/Confirmation";
import PostJob from "./src/components/PostJob";
import Photo from "./src/components/photo";
import Register from "./src/components/RegisterScreen";
//import './node_modules/bootstrap/dist/css/bootstrap.min.css';
import UploadImage from "./src/containers/UploadImage";
import JobAdditionalInfo from "./src/containers/job_seeker/JobAdditionalInfo";
import JobBasicInfo from "./src/containers/job_seeker/JobBasicInfo";
import JobUploadImage from "./src/containers/job_seeker/JobUploadImage";
import JobPost from "./src/containers/JobPost";
import ForgatPassword from "./src/containers/ForgatPassword";
// JobSeeker's import
import JobSeekerScreen from "./src/components/job_seeker/JobSeekerScreen";
import JobSeekerProfile from "./src/components/job_seeker/JobSeekerProfile";
import EmployerProfile from "./src/components/job_seeker/EmployerProfile";
import InviteFriends from "./src/components/InviteFriends";
import StarredJobs from "./src/components/StarredJobs";
import ChangePassword from "./src/containers/job_seeker/ChangePassword";
import EmployerScreen from "./src/components/employer/EmployerScreen";
import EmployerProfile1 from "./src/components/employer/EmployerProfile1";
import JobSeekerProfile1 from "./src/components/employer/JobSeekerProfile1";
import StarredCandidate from "./src/components/employer/StarredCandidate";
import ChangeEmployerPassword from "./src/components/employer/ChangeEmployerPassword";
import EditProfile from "./src/components/job_seeker/EditProfile";
import ApplicantList from "./src/components/employer/ApplicantList";
import EditEmployerProfile from "./src/components/employer/EditEmployerProfile";
import NewPassword from "./src/containers/NewPassword";
import SuccessScreen from "./src/containers/SuccessScreen";
import SocialLogin from "./src/containers/SocialLogin";
import PaymentScreen from "./src/containers/PaymentScreen";
import Browser from "./src/containers/Browser";
const navigator = createStackNavigator(
    {
        Home: HomeScreen,
        Login: LogIn,
        JobPost: {
            screen: JobPost,
            navigationOptions: {
                headerShown: false,
            },
        },
        JobAdditionalInfo: {
            screen: JobAdditionalInfo,
            navigationOptions: {
                headerShown: false,
            },
        },
        JobBasicInfo: {
            screen: JobBasicInfo,
            navigationOptions: {
                headerShown: false,
            },
        },
        JobUploadImage: {
            screen: JobUploadImage,
            navigationOptions: {
                headerShown: false,
            },
        },
        Basic: BasicInfo,
        Basic0: {
            screen: BasicInfo0,
            navigationOptions: {
                headerShown: false,
            },
        },
        AddInfo: {
            screen: AdditionalInfo,
            navigationOptions: {
                headerShown: false,
            },
        },
        UploadPic: {
            screen: UploadImage,
            navigationOptions: {
                headerShown: false,
            },
        },
        MembershipPage: {
            screen: Membership,
            navigationOptions: {
                headerShown: false,
            },
        },
        //PaymentPage: Payment,
        Payment1Page: {
            screen: Payment1,
            navigationOptions: {
                headerShown: false,
            },
        },
        ConfirmationPage: {
            screen: Confirmation,
            navigationOptions: {
                headerShown: false,
            },
        },
        NewPassword: NewPassword,
        ForgatPassword: ForgatPassword,
        PostJobPage: PostJob,
        UploadPhoto: Photo,
        RegisterScr: {
            screen: Register,
            navigationOptions: {
                headerShown: false,
            },
        },
        JobSeekerScreen,
        JobSeekerProfile,
        EmployerProfile,
        InviteFriends,
        StarredJobs,
        ChangePassword,
        EmployerScreen,
        EmployerProfile1,
        JobSeekerProfile1,
        StarredCandidate,
        ChangeEmployerPassword,
        EditJobSeekerProfile: EditProfile,
        ApplicantList,
        EditEmployerProfile,
        SuccessScreen: {
            screen: SuccessScreen,
            navigationOptions: {
                headerShown: false,
            },
        },
        SocialLogin: {
            screen: SocialLogin,
            navigationOptions: {
                title: "Social Login",
                headerShown: true,
            },
        },
        PaymentScreen: {
            screen: PaymentScreen,
            navigationOptions: {
                title: "Payment Screen",
                headerShown: false,
            },
        },
        Browser: {
            screen: Browser,
            navigationOptions: {
                title: "Payment Screen",
                headerShown: false,
            },
        },
    },
    {
        initialRouteName: "Home",
        defaultNavigationOptions: {
            title: "InCareOf",
        },
    }
);

export default createAppContainer(navigator);

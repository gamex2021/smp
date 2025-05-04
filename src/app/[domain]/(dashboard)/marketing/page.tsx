import { RoleProtected } from "@/components/providers/role-protected";
import LandingPageCustomization from "@/features/marketing";

type IAppProps = Record<string, unknown>;

const Marketing: React.FunctionComponent<IAppProps> = (props) => {
  

    return (
        <RoleProtected allowedRoles={['ADMIN']}>
           <LandingPageCustomization />  
        </RoleProtected>
     
    )
};

export default Marketing;

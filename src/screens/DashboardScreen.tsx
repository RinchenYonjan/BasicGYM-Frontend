import BodySectionComp from "@/components/Dashboard Component/BodySectionComp";
import HeaderComp from "@/components/Dashboard Component/HeaderComp";
import PaymentDueCardComp from "@/components/Dashboard Component/PaymentDueCardComp";
import RecentPaymentComp from "@/components/Dashboard Component/RecentPaymentComp";
import SummaryCardComp from "@/components/Dashboard Component/SummaryCardComp";
import { View } from "react-native";



export function DashboardScreen(){
    return (
        <View style={{backgroundColor:'#d3d3d370'}}>

            <HeaderComp/>
            <SummaryCardComp/>
            <PaymentDueCardComp/>
            <BodySectionComp/>
            <RecentPaymentComp/>
            
        </View>
    )
}
import BodySectionComp from "@/components/Dashboard Component/BodySectionComp";
import HeadingSectionComp from "@/components/Dashboard Component/HeadingSectionComp";
import PaymentDueCardComp from "@/components/Dashboard Component/PaymentDueCardComp";
import RecentPaymentComp from "@/components/Dashboard Component/RecentPaymentComp";
import SummaryCardComp from "@/components/Dashboard Component/SummaryCardComp";
import { View } from "react-native";



export function DashboardScreen(){
    return (
        <View>

            <HeadingSectionComp/>
            <SummaryCardComp/>
            <PaymentDueCardComp/>
            <BodySectionComp/>
            <RecentPaymentComp/>
            
        </View>
    )
}
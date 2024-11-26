'use client';
import {ActivityCard} from '@/components'

export default function Cheking() {
    function handleMoreDetails() {
        console.log('s')
    }
    function handleAcceptActivity() {
        console.log('s')
    }
    function handleCancellRequestActivity() {
        console.log('s')
    }
    function handleRequesterDetails() {
        console.log('s')
    }
    function handleUpdateActivity() {
        console.log('s')
    }
    function handleCancellProposalActivity() {
        console.log('s')
    }
    
    return (
        <ActivityCard 
            activity={{_id: "6742e1f714108540e203ac59",
                nameActivity: "שיעור פסנתר",
                tags:["שיעור פרטי","נגינה"],
                durationHours: 1,
                description:"שיעור פרטי לנגינת פסנתר. מועבר על ידי מורה מוסמכת ומקצועית. מתאים לבנות מגיל 12",
                giverId: "6742de4714108540e203ac55",
                receiverId: "6742dfb914108540e203ac56",
                status: "caught"}}
            handleMoreDetails={handleMoreDetails}
            // handlesMoreOptions={{
            //     // handleAcceptActivity:handleAcceptActivity,
            //     // handleCancellRequestActivity:handleCancellRequestActivity,
            //     // handleRequesterDetails:handleRequesterDetails,
            //     handleUpdateActivity:handleUpdateActivity,
            //     handleCancellProposalActivity:handleCancellProposalActivity
            // }}
        />
    );
}


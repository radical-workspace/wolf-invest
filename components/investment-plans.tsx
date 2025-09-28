import React from 'react';
import './InvestmentPlans.css'; // Assuming you have a CSS file for styling

const InvestmentPlans = () => {
    const plans = [
        {
            name: "Nova 30",
            description: "Starter Plan",
            roi: "Daily ROI 0.5%-1%",
            amount: "$200-$999",
            lockup: "30 days lockup",
        },
        {
            name: "Momentum 30",
            description: "Growth Plan",
            roi: "Daily ROI 1%-1.5%",
            amount: "$1,000-$1,999",
            lockup: "30 days lockup",
        },
        {
            name: "Atlas 180",
            description: "Semiannual Stability",
            roi: "Daily ROI 1.5%-2%",
            amount: "$2,000-$9,999",
            lockup: "180 days lockup",
        },
        {
            name: "Zenith 365",
            description: "Annual Elite",
            roi: "Daily ROI 2%-2.5%",
            amount: "$10,000+",
            lockup: "365 days lockup",
        },
    ];

    return (
        <div className="investment-plans">
            {plans.map(plan => (
                <div className="plan-card" key={plan.name}>
                    <h2>{plan.name}</h2>
                    <p>{plan.description}</p>
                    <p>{plan.roi}</p>
                    <p>{plan.amount}</p>
                    <p>{plan.lockup}</p>
                    <button className="cta-button">Invest Now</button>
                </div>
            ))}
        </div>
    );
}

export default InvestmentPlans;
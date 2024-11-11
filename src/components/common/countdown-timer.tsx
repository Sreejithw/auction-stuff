import React, { useEffect, useState } from 'react'

type CountdownTimerProps = {
    endDate: Date;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endDate }) => {
    const [timeLeft, setTimeLeft] = useState<string>("");

    useEffect(() => {
        const targetDate = new Date(endDate);

        const updateCountDown = () => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference <= 0) {
                setTimeLeft("Bidding over");
                return;
            }

            // Calculate days, hours, minutes, and seconds
            const totalHours = Math.floor(difference / (1000 * 60 * 60));
            const hours = totalHours % 24;
            const days = Math.floor(totalHours / 24);
            const minutes = Math.floor((difference / (1000 * 60)) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
        updateCountDown();
        const intervalId = setInterval(updateCountDown, 1000);

        return () => clearInterval(intervalId);

    }, [endDate])
    return <p className="text-2xl font-bold text-red-600">{timeLeft}</p>;
}

export default CountdownTimer;
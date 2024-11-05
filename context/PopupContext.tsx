import React, { createContext, useState, useContext, ReactNode } from 'react';
import CustomPopup from '@/components/CustomPopup'; // Import CustomPopup

// Define the types for the context values
interface PopupContextType {
    popupVisible: boolean;
    popupMessage: string;
    showPopup: (message: string, callback?: () => void) => void;
}

// Create the context with an initial value
const PopupContext = createContext<PopupContextType | undefined>(undefined);

interface PopupProviderProps {
    children: ReactNode;
}

export const PopupProvider: React.FC<PopupProviderProps> = ({ children }) => {
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const showPopup = (message: string, callback?: () => void) => {
        setPopupMessage(message);
        setPopupVisible(true);
        
        // Keep the popup visible for a short duration, then hide it
        setTimeout(() => {
            setPopupVisible(false);
            // Execute the callback function after the popup is hidden
            if (callback) callback();
        }, 3000); // 3 seconds to hide the popup
    };

    return (
        <PopupContext.Provider value={{ popupVisible, popupMessage, showPopup }}>
            {children}
            {/* Render CustomPopup */}
            <CustomPopup
                visible={popupVisible}
                message={popupMessage}
                onClose={() => setPopupVisible(false)}
            />
        </PopupContext.Provider>
    );
};

// Custom hook to use the PopupContext
export const usePopup = (): PopupContextType => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error('usePopup must be used within a PopupProvider');
    }
    return context;
};

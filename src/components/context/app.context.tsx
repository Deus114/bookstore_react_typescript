import { createContext, useContext, useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import { fetchAccountApi } from "services/api";

interface IAppContext {
    isAuthenticated: boolean;
    setIsAuthenticated: (v: boolean) => void;
    setUser: (v: IUser | null) => void;
    user: IUser | null;
    isAppLoading: boolean;
    setIsAppLoading: (v: boolean) => void;
    carts: ICarts[];
    setCarts: (v: ICarts[]) => void;
}

const CurrentAppContext = createContext<IAppContext | null>(null);

export const AppProvider = (props: IProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
    const [carts, setCarts] = useState<ICarts[]>([]);

    useEffect(() => {
        const fetchAccount = async () => {
            const res = await fetchAccountApi();
            if (res.data) {
                setUser(res.data.user);
                setIsAuthenticated(true);
            }
            setIsAppLoading(false)
        }

        fetchAccount();
    }, [])

    return (
        <>
            {
                isAppLoading ?
                    <div style={{
                        position: "fixed",
                        top: "50%", left: "50%",
                        transform: "translate(-50%, -50%)"
                    }}>
                        <HashLoader
                            size={50}
                            color="#36d6b4"
                        />
                    </div>
                    :
                    <CurrentAppContext.Provider value={{
                        isAuthenticated, user, setIsAuthenticated, setUser,
                        isAppLoading, setIsAppLoading, carts, setCarts
                    }}>
                        {props.children}
                    </CurrentAppContext.Provider>
            }
        </>
    );
};

export const useCurrentApp = () => {
    const currentAppContext = useContext(CurrentAppContext);

    if (!currentAppContext) {
        throw new Error(
            "useCurrentUser has to be used within <CurrentUserContext.Provider>"
        );
    }

    return currentAppContext;
};
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

interface Coord {
    latitude: number | null;
    longitude: number | null;
}

interface RegionContextType {
    region: Region;
    setRegion: React.Dispatch<React.SetStateAction<Region>>;
    cityCoord: Coord;
    setCityCoord: React.Dispatch<React.SetStateAction<Coord>>;
}

const RegionContext = createContext<RegionContextType | null>(null);

export const useRegion = () => {
    const context = useContext(RegionContext);
    if (!context) {
        throw new Error("useRegion must be used within a RegionProvider");
    }
    return context;
};

interface RegionProviderProps {
    children: ReactNode;
}

export const RegionProvider: React.FC<RegionProviderProps> = ({ children }) => {
    const [region, setRegion] = useState<Region>({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
    });

    const [cityCoord, setCityCoord] = useState<Coord>({ latitude: null, longitude: null });

    return (
        <RegionContext.Provider value={{ region, setRegion, cityCoord, setCityCoord }}>
            {children}
        </RegionContext.Provider>
    );
};

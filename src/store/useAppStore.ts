import { create } from "zustand";
import type { AppState } from "../types/types";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";

const initialState = {
    connection: {
        isConnected: false,
        isConnecting: false,
        error: null
    },
    currentUser: null,
    currentRoom: null,
    availableRooms: [],
    drawEvents: [],
    isDrawing: false,
}


export const useAppStore = create<AppState>()(
    devtools(
        immer(
            (set) => ({
                ...initialState,

                setConnection: (connectionState) => set((state) => {
                    Object.assign(state.connection, connectionState);
                }),

                setCurrentUser: (user) => set((state) => {
                    state.currentUser = user;
                }),

                setCurrentRoom: (room) => set((state) => {
                    state.currentRoom = room;
                }),

                setAvailableRooms: (rooms) => set((state) => {
                    state.availableRooms = rooms;
                }),

                updateRoom: (updatedRoom) => set((state) => {
                    const index = state.availableRooms.findIndex(room => room.id === updatedRoom.id);
                    if (index !== -1) {
                        state.availableRooms[index] = updatedRoom;
                    }
                }),

                addDrawEvent: (event) => set((state) => {
                    state.drawEvents.push(event);
                }),

                setIsDrawing: (isDrawing) => set((state) => {
                    state.isDrawing = isDrawing;
                }),

                clearDrawEvents: () => set((state) => {
                    state.drawEvents = [];
                }),

                reset: () => set(() => ({ ...initialState })),

                resetState: () => set(() => ({ ...initialState })),
            })
        ),
        { name: 'app-store' }
    )
);
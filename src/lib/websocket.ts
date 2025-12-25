import { io, Socket } from "socket.io-client";
import { MAPBOX_CONFIG } from "@/config";
import { toast } from "sonner";

// Types for WebSocket events
export interface LocationUpdate {
  driverId: string;
  location: {
    lat: number;
    lng: number;
    timestamp: string;
    speed?: number;
    heading?: number;
  };
}

export interface RideStatusUpdate {
  rideId: string;
  status: string;
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface ETAUpdate {
  rideId: string;
  eta: string;
  delay: number;
  distance: number;
}

export interface SocketError {
  type: string;
  message: string;
  code?: string;
}

// Event callback types
type LocationUpdateCallback = (data: LocationUpdate) => void;
type RideStatusUpdateCallback = (data: RideStatusUpdate) => void;
type ETAUpdateCallback = (data: ETAUpdate) => void;
type ErrorCallback = (error: SocketError) => void;
type ConnectCallback = () => void;
type DisconnectCallback = (reason: string) => void;

// WebSocket service class
class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  // Event callbacks
  private locationUpdateCallbacks: LocationUpdateCallback[] = [];
  private rideStatusUpdateCallbacks: RideStatusUpdateCallback[] = [];
  private etaUpdateCallbacks: ETAUpdateCallback[] = [];
  private errorCallbacks: ErrorCallback[] = [];
  private connectCallbacks: ConnectCallback[] = [];
  private disconnectCallbacks: DisconnectCallback[] = [];

  // Connection state
  private isConnected = false;
  private currentRideId: string | null = null;
  private currentDriverId: string | null = null;

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    try {
      // Get JWT token from localStorage or cookies
      const token = this.getAuthToken();

      this.socket = io(MAPBOX_CONFIG.websocket.url, {
        auth: {
          token: token,
        },
        transports: ["websocket", "polling"],
        timeout: 20000,
        forceNew: true,
      });

      this.setupEventListeners();
    } catch {
      toast.error("Failed to initialize WebSocket");
    }
  }

  private getAuthToken(): string | null {
    // Try to get token from localStorage first
    let token = localStorage.getItem("accessToken");

    // If not found, try to get from cookies
    if (!token) {
      const cookies = document.cookie.split(";");
      const tokenCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("accessToken="),
      );

      if (tokenCookie) {
        token = tokenCookie.split("=")[1];
      }
    }

    return token || null;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on("connect", () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.connectCallbacks.forEach((callback) => callback());
    });

    this.socket.on("disconnect", (reason) => {
      this.isConnected = false;
      this.disconnectCallbacks.forEach((callback) => callback(reason));

      // Attempt to reconnect if not manually disconnected
      if (reason !== "io client disconnect") {
        this.attemptReconnect();
      }
    });

    this.socket.on("connect_error", (error) => {
      this.errorCallbacks.forEach((callback) =>
        callback({
          type: "CONNECTION_ERROR",
          message: "Failed to connect to real-time service",
          code: error.message,
        }),
      );
    });

    // Real-time data events
    this.socket.on("driver-location-update", (data: LocationUpdate) => {
      this.locationUpdateCallbacks.forEach((callback) => callback(data));
    });

    this.socket.on("ride-status-update", (data: RideStatusUpdate) => {
      this.rideStatusUpdateCallbacks.forEach((callback) => callback(data));
    });

    this.socket.on("eta-update", (data: ETAUpdate) => {
      this.etaUpdateCallbacks.forEach((callback) => callback(data));
    });

    // Error handling
    this.socket.on("error", (error: SocketError) => {
      this.errorCallbacks.forEach((callback) => callback(error));
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      toast.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    setTimeout(() => {
      this.initializeSocket();
    }, delay);
  }

  // Public methods

  // Connection management
  connect(): void {
    if (this.socket && !this.isConnected) {
      this.socket.connect();
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.isConnected = false;
  }

  isSocketConnected(): boolean {
    return this.isConnected;
  }

  // Room management
  joinRide(rideId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit("join-ride", { rideId });
      this.currentRideId = rideId;
    }
  }

  leaveRide(): void {
    if (this.socket && this.isConnected && this.currentRideId) {
      this.socket.emit("leave-ride", { rideId: this.currentRideId });
      this.currentRideId = null;
    }
  }

  trackDriver(driverId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit("track-driver", { driverId });
      this.currentDriverId = driverId;
    }
  }

  stopTrackingDriver(): void {
    if (this.socket && this.isConnected && this.currentDriverId) {
      this.socket.emit("stop-tracking-driver", {
        driverId: this.currentDriverId,
      });
      this.currentDriverId = null;
    }
  }

  // Event subscription methods
  onLocationUpdate(callback: LocationUpdateCallback): () => void {
    this.locationUpdateCallbacks.push(callback);
    return () => {
      const index = this.locationUpdateCallbacks.indexOf(callback);
      if (index > -1) {
        this.locationUpdateCallbacks.splice(index, 1);
      }
    };
  }

  onRideStatusUpdate(callback: RideStatusUpdateCallback): () => void {
    this.rideStatusUpdateCallbacks.push(callback);
    return () => {
      const index = this.rideStatusUpdateCallbacks.indexOf(callback);
      if (index > -1) {
        this.rideStatusUpdateCallbacks.splice(index, 1);
      }
    };
  }

  onETAUpdate(callback: ETAUpdateCallback): () => void {
    this.etaUpdateCallbacks.push(callback);
    return () => {
      const index = this.etaUpdateCallbacks.indexOf(callback);
      if (index > -1) {
        this.etaUpdateCallbacks.splice(index, 1);
      }
    };
  }

  onError(callback: ErrorCallback): () => void {
    this.errorCallbacks.push(callback);
    return () => {
      const index = this.errorCallbacks.indexOf(callback);
      if (index > -1) {
        this.errorCallbacks.splice(index, 1);
      }
    };
  }

  onConnect(callback: ConnectCallback): () => void {
    this.connectCallbacks.push(callback);
    return () => {
      const index = this.connectCallbacks.indexOf(callback);
      if (index > -1) {
        this.connectCallbacks.splice(index, 1);
      }
    };
  }

  onDisconnect(callback: DisconnectCallback): () => void {
    this.disconnectCallbacks.push(callback);
    return () => {
      const index = this.disconnectCallbacks.indexOf(callback);
      if (index > -1) {
        this.disconnectCallbacks.splice(index, 1);
      }
    };
  }

  // Cleanup method
  destroy(): void {
    this.disconnect();

    // Clear all callbacks
    this.locationUpdateCallbacks = [];
    this.rideStatusUpdateCallbacks = [];
    this.etaUpdateCallbacks = [];
    this.errorCallbacks = [];
    this.connectCallbacks = [];
    this.disconnectCallbacks = [];

    this.socket = null;
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;

// React hook for using WebSocket
export const useWebSocket = () => {
  return {
    connect: () => websocketService.connect(),
    disconnect: () => websocketService.disconnect(),
    isConnected: () => websocketService.isSocketConnected(),
    joinRide: (rideId: string) => websocketService.joinRide(rideId),
    leaveRide: () => websocketService.leaveRide(),
    trackDriver: (driverId: string) => websocketService.trackDriver(driverId),
    stopTrackingDriver: () => websocketService.stopTrackingDriver(),
    onLocationUpdate: (callback: LocationUpdateCallback) =>
      websocketService.onLocationUpdate(callback),
    onRideStatusUpdate: (callback: RideStatusUpdateCallback) =>
      websocketService.onRideStatusUpdate(callback),
    onETAUpdate: (callback: ETAUpdateCallback) =>
      websocketService.onETAUpdate(callback),
    onError: (callback: ErrorCallback) => websocketService.onError(callback),
    onConnect: (callback: ConnectCallback) =>
      websocketService.onConnect(callback),
    onDisconnect: (callback: DisconnectCallback) =>
      websocketService.onDisconnect(callback),
  };
};

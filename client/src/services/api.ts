const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('kisansetu_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const rawText = await response.text();
      let data: any = {};

      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch (parseError) {
        if (!response.ok) {
          throw new Error(`API error ${response.status}: ${rawText.slice(0, 80)}`);
        }
        throw new Error(`Invalid JSON response: ${rawText.slice(0, 80)}`);
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error ${response.status}`);
      }

      return data as T;
    } catch (error: any) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Auth
  sendOtp(phone: string) {
    return this.request<{ success: boolean; message: string; demoHint: string }>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  verifyOtp(phone: string, otp: string, role = 'FARMER') {
    return this.request<{ success: boolean; token: string; user: any; isNewUser: boolean }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp, role }),
    });
  }

  demoLogin(role: string) {
    return this.request<{ success: boolean; token: string; user: any; message: string }>('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
  }

  officialLogin(email: string, password: string) {
    return this.request<{ success: boolean; token: string; user: any; message: string }>('/auth/official-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  getMe() {
    return this.request<{ success: boolean; user: any }>('/auth/me');
  }

  // Farmer
  getFarmerProfile() {
    return this.request<{ success: boolean; farmer: any }>('/farmer/profile');
  }

  getFarmerDashboardSummary() {
    return this.request<{ success: boolean; isRegistered: boolean; farmer: any; crops: any[]; activeBooking: any; totalBookingsCount: number }>('/farmer/dashboard-summary');
  }

  registerFarmer(payload: any) {
    return this.request<{ success: boolean; farmer: any; message: string }>('/farmer/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  registerFarmerSimplified(payload: { fullName: string; phone: string; dob: string; email?: string; stateId?: string; districtId?: string }) {
    return this.request<{ success: boolean; token: string; user: any; message: string }>('/auth/farmer-register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // States
  getStates() {
    return this.request<{ success: boolean; states: any[] }>('/states');
  }

  getStateDetails(stateId: string) {
    return this.request<{ success: boolean; state: any }>(`/states/${stateId}`);
  }

  getStateConfig(stateId: string) {
    return this.request<{ success: boolean; config: any }>(`/states/${stateId}/config`);
  }

  updateStateConfig(stateId: string, payload: any) {
    return this.request<{ success: boolean; message: string; config: any }>(`/states/${stateId}/config`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  // Centers
  getCenters(params?: { stateId?: string; districtId?: string; cropId?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.stateId) query.append('stateId', params.stateId);
    if (params?.districtId) query.append('districtId', params.districtId);
    if (params?.cropId) query.append('cropId', params.cropId);
    if (params?.search) query.append('search', params.search);

    return this.request<{ success: boolean; centers: any[] }>(`/centers?${query.toString()}`);
  }

  getCenterDetails(id: string) {
    return this.request<{ success: boolean; center: any }>(`/centers/${id}`);
  }

  getCenterStatus(id: string) {
    return this.request<{ success: boolean; status: any }>(`/centers/${id}/status`);
  }

  getSmartRecommendation(payload: { stateId?: string; districtId?: string; cropId?: string }) {
    return this.request<{ success: boolean; recommendation: any; alternatives: any[] }>('/centers/recommend', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Slots
  getAvailableSlots(centerId: string, cropId?: string, date?: string) {
    const query = new URLSearchParams({ centerId });
    if (cropId) query.append('cropId', cropId);
    if (date) query.append('date', date);

    return this.request<{ success: boolean; center: any; slots: any[] }>(`/slots/available?${query.toString()}`);
  }

  bookSlot(payload: {
    slotId: string;
    centerId: string;
    cropId: string;
    quantityQuintals: number;
    vehicleNumber?: string;
    vehicleType?: string;
  }) {
    return this.request<{ success: boolean; message: string; booking: any }>('/slots/book', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  getTokenDetails(tokenCode: string) {
    return this.request<{ success: boolean; booking: any }>(`/slots/token/${tokenCode}`);
  }

  // Live Queue
  getLiveQueue(centerId: string, tokenNumber?: string) {
    const query = tokenNumber ? `?tokenNumber=${encodeURIComponent(tokenNumber)}` : '';
    return this.request<{
      success: boolean;
      center: any;
      currentlyServing: any;
      totalWaitingCount: number;
      queueEntries: any[];
      farmerQueueInfo: any;
      lastUpdated: string;
    }>(`/queue/${centerId}${query}`);
  }

  callNextToken(centerId?: string) {
    return this.request<{ success: boolean; message: string; calledEntry: any }>('/queue/call-next', {
      method: 'POST',
      body: JSON.stringify({ centerId }),
    });
  }

  updateQueueStage(queueEntryId: string, stage: string, gateNumber?: string) {
    return this.request<{ success: boolean; message: string; updated: any }>('/queue/update-stage', {
      method: 'POST',
      body: JSON.stringify({ queueEntryId, stage, gateNumber }),
    });
  }

  pauseQueue(centerId: string, isPaused: boolean, pauseReason?: string) {
    return this.request<{ success: boolean; message: string; isOperational: boolean }>('/queue/pause', {
      method: 'POST',
      body: JSON.stringify({ centerId, isPaused, pauseReason }),
    });
  }

  // Procurement & J-Form
  getProcurementRecords() {
    return this.request<{ success: boolean; records: any[] }>('/procurement');
  }

  getProcurementDetails(id: string) {
    return this.request<{ success: boolean; record: any }>(`/procurement/${id}`);
  }

  recordProcurement(payload: any) {
    return this.request<{ success: boolean; message: string; procurementRecord: any; paymentRecord: any }>('/procurement/record-entry', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Notifications
  getNotifications() {
    return this.request<{ success: boolean; notifications: any[]; unreadCount: number }>('/notifications');
  }

  markNotificationRead(id: string) {
    return this.request<{ success: boolean; updated: any }>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  triggerMockNotification(payload: any) {
    return this.request<{ success: boolean; message: string; notification: any }>('/notifications/mock-send', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Super Admin
  getSuperAdminAnalytics() {
    return this.request<{ success: boolean; nationalMetrics: any; stateAnalytics: any[]; recentAuditLogs: any[] }>('/admin/analytics');
  }

  getGovernmentMandiRoster() {
    return this.request<{ success: boolean; totalMandis: number; accessLevel: string; mandis: any[] }>('/admin/centers/government-roster');
  }

  addProcurementCenter(data: any) {
    return this.request<{ success: boolean; message: string; center: any }>('/admin/centers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  deleteProcurementCenter(centerId: string) {
    return this.request<{ success: boolean; message: string }>(`/admin/centers/${centerId}`, {
      method: 'DELETE',
    });
  }

  toggleMandiStatus(centerId: string) {
    return this.request<{ success: boolean; message: string; isOperational: boolean }>(`/admin/centers/${centerId}/toggle-status`, {
      method: 'PATCH',
    });
  }

  getDistrictAdminAnalytics(districtId = 'dist-hr-sonipat') {
    return this.request<{ success: boolean; district: any; centerPerformances: any[]; hourlyBookingsChart: any[]; cropDistribution: any[] }>(`/admin/district/${districtId}`);
  }

  getOfficerDashboardStats(centerId = 'center-sonipat-main') {
    return this.request<{ success: boolean; center: any; stats: any; liveQueue: any[] }>(`/admin/officer/${centerId}`);
  }

  // Open Data & Live Weather Radar (e-NAM / Agmarknet / Open-Meteo)
  getLiveMarketPrices(crop?: string, state?: string) {
    const query = new URLSearchParams();
    if (crop) query.append('crop', crop);
    if (state) query.append('state', state);
    return this.request<{ success: boolean; dataSource: string; lastSyncTime: string; prices: any[] }>(`/open-data/mandi-prices?${query.toString()}`);
  }

  getCenterWeatherRadar(centerId: string) {
    return this.request<{ success: boolean; centerName: string; coordinates: any; weather: any; lastUpdated: string }>(`/open-data/weather-sync/${centerId}`);
  }

  searchPlaceWeather(query: string) {
    return this.request<{
      success: boolean;
      query: string;
      centerId: string | null;
      centerName: string;
      coordinates: any;
      weather: any;
      lastUpdated: string;
    }>(`/open-data/weather-search?query=${encodeURIComponent(query)}`);
  }

  // Central e-NAM (https://enam.gov.in) Live Sync & Slot Reconciliation
  getEnamNetworkStatus() {
    return this.request<{
      success: boolean;
      gateway: string;
      portalUrl: string;
      syncStatus: string;
      pulseIntervalSeconds: number;
      latencyMs: number;
      networkMetrics: any;
      lastHeartbeat: string;
    }>('/open-data/enam/network-status');
  }

  getEnamMandiSlots(centerId: string) {
    return this.request<{
      success: boolean;
      mandi: any;
      date: string;
      reconciliationMetrics: any;
      timeSlots: any[];
      recentEnamLots: any[];
      syncMeta: any;
    }>(`/open-data/enam/slots/${centerId}`);
  }
}

export const api = new ApiClient();

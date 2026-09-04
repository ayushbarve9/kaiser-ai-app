export type UrgencyLevel = "Critical" | "High" | "Medium" | "Low";
export type ComplaintStatus = "Reported" | "Assigned" | "In Progress" | "Resolved";
export type ComplaintCategory = 
  | "Pothole" 
  | "Garbage" 
  | "Drainage" 
  | "Streetlight" 
  | "Water Leakage" 
  | "Roadwork" 
  | "Other";

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  text: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  severity: number; // 1 to 100
  urgency: UrgencyLevel;
  status: ComplaintStatus;
  latitude: number;
  longitude: number;
  ward: number;
  wardName: string;
  locationAddress: string;
  imageUrl?: string;
  reporterId: string;
  reporterName: string;
  upvotes: string[];
  upvote_count: number;
  comment_count: number;
  comments: Comment[];
  assignedDepartment?: string;
  slaDays: number;
  aiSummary?: string;
  aiSuggestedAction?: string;
  isImageRejected?: boolean;
  rejectionReason?: string;
  reporterEmail?: string;
  afterImageUrl?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  resolutionOfficerName?: string;
  resolutionOfficerDepartment?: string;
  resolutionOfficerContact?: string;
  resolutionEmailSent?: boolean;
  resolutionEmailDetails?: {
    to: string;
    subject: string;
    sentAt: string;
    officerName: string;
    officerDepartment: string;
    officerContact?: string;
    resolutionNotes: string;
    trackingId: string;
    beforeImageUrl?: string;
    afterImageUrl?: string;
    emailBodyHtml?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "Citizen" | "Officer" | "Admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  ward: number;
  department?: string;
  phone?: string;
  serviceId?: string;
}

export interface WardOfficer {
  name: string;
  designation: string;
  contact: string;
  email: string;
  address: string;
  avatar: string;
  problemsSolved: number;
  totalAssigned: number;
  resolutionRate: number; // percentage
  avgResolutionDays: number;
  citizenSatisfaction: number; // 1-5 rating
  rank: number;
}

export interface WardWeatherAQI {
  aqi: number;
  aqiCategory: "Good" | "Moderate" | "Poor" | "Unhealthy" | "Severe";
  pm25: number;
  pm10: number;
  temp: number; // in °C
  condition: string;
  humidity: number; // percentage
  windSpeed: number; // km/h
}

export interface MumbaiWard {
  id: number;
  code: string;
  name: string;
  areaDescription: string;
  areas: string[];
  primaryRailwayStations: string;
  railwayCorridor: "Island City" | "Western Suburbs" | "Eastern Suburbs";
  officer: WardOfficer;
  weatherAndAqi: WardWeatherAQI;
  lat: number;
  lng: number;
}

export interface Stats {
  total: number;
  resolved: number;
  inProgress: number;
  assigned: number;
  reported: number;
  avgSeverity: number;
  slaComplianceRate: number;
  categoryData: { name: string; count: number }[];
  wardData: { ward: string; count: number }[];
}

export interface AIAnalysisResult {
  severity: number;
  urgency: UrgencyLevel;
  category: ComplaintCategory;
  assignedDepartment: string;
  slaDays: number;
  aiSummary: string;
  aiSuggestedAction: string;
}

export interface YoloBoundingBox {
  label: string;
  confidence: number; // 0 to 1 or 0 to 100
  bbox: [number, number, number, number]; // [ymin, xmin, ymax, xmax] in percentages (0-100)
  color: "green" | "red" | "yellow" | "blue";
  isHazard?: boolean;
  isFraud?: boolean;
}

export interface YoloDetectionMeta {
  model: string;
  inferenceTimeMs: number;
  detectedBoxes: YoloBoundingBox[];
  cameraMetadata?: {
    isOriginalSensor: boolean;
    deviceType: string;
    hasExifGps?: boolean;
  };
}

export interface AIVerifyImageResult {
  isValidCivicIssue: boolean;
  detectedObject: string;
  isCategoryMatch: boolean;
  isAIGenerated?: boolean;
  isRealCameraPhoto?: boolean;
  confidenceScore: number;
  rejectionReason?: string;
  suggestedCategory?: string;
  yoloDetection?: YoloDetectionMeta;
}

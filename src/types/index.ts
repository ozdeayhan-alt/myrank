export interface RegisterProfile {
  username: string
  fullName?: string
  country: string
  city: string
  gender: string
  age: string
  profession: string
  maritalStatus: string
  interests: string
}

export interface AuthUser {
  id: string
  username: string
  profile: RegisterProfile
}

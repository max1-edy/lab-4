export interface CharacterModel {
  id: string
  name: string
  avatar_url: string
  starting_coins: number
  starting_bombs: number
  luck: number
  jam_rate: number
  surprise_chance: number
  description: string
}

export interface GreedStateModel {
  session_id: string
  name: string
  character: CharacterModel
  wallet: number
  coins_in_machine: number
  jam_chance: number
  is_jammed: boolean
  is_exploded: boolean
  bombs: number
  total_donations: number
}

export interface CreateSessionRequest {
  character_id?: string | null
  custom_name?: string | null
}

export interface SessionValidationModel {
  valid: boolean
  session_id: string
  name: string
  character_id: string
  character_name: string
  coins_in_machine: number
  is_jammed: boolean
  created_at: number
}

export interface PayloadModel {
  id: string
  name: string
  type?: string
  code: string
}

export interface DonateResponse {
  success: boolean
  message: string
  wallet: number
  coins_in_machine: number
  jam_chance: number
  is_jammed: boolean
  payload?: PayloadModel | null
}

export interface BombResponse {
  success: boolean
  message: string
  coins_in_machine: number
  wallet: number
  bombs: number
  is_jammed: boolean
  is_exploded: boolean
}

export interface ResetRequest {
  character_id?: string | null
  reset_machine?: boolean
}

export interface SavedSession {
  id: string
  name: string
  characterId: string
  characterName: string
}

export type ToastType = 'info' | 'success' | 'warning' | 'error'

export interface ToastItem {
  id: string
  message: string
  type: ToastType
}

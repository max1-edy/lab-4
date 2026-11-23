import { httpClient } from '@/api/httpClient'
import type {
  BombResponse,
  CharacterModel,
  CreateSessionRequest,
  DonateResponse,
  GreedStateModel,
  ResetRequest,
  SessionValidationModel,
} from '@/types/greed'

export const greedService = {
  async getCharacters(): Promise<CharacterModel[]> {
    const { data } = await httpClient.get<CharacterModel[]>('/api/greed/characters')
    return data
  },

  async createSession(payload?: CreateSessionRequest): Promise<GreedStateModel> {
    const { data } = await httpClient.post<GreedStateModel>('/api/greed/session/new', payload ?? {})
    return data
  },

  async verifySession(sessionId: string): Promise<SessionValidationModel> {
    const { data } = await httpClient.get<SessionValidationModel>(
      `/api/greed/session/${encodeURIComponent(sessionId)}/verify`,
    )
    return data
  },

  async getState(): Promise<GreedStateModel> {
    const { data } = await httpClient.get<GreedStateModel>('/api/greed/state')
    return data
  },

  async selectCharacter(characterId: string): Promise<GreedStateModel> {
    const { data } = await httpClient.post<GreedStateModel>('/api/greed/select-character', null, {
      params: { character_id: characterId },
    })
    return data
  },

  async donateCoin(): Promise<DonateResponse> {
    const { data } = await httpClient.post<DonateResponse>('/api/greed/donate')
    return data
  },

  async useBomb(): Promise<BombResponse> {
    const { data } = await httpClient.post<BombResponse>('/api/greed/bomb')
    return data
  },

  async resetSession(payload?: ResetRequest): Promise<GreedStateModel> {
    const { data } = await httpClient.post<GreedStateModel>('/api/greed/reset', payload ?? {})
    return data
  },
}

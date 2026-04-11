import { Autumn, type Balance } from "autumn-js"
import { env } from "@/env.server"

const autumn = new Autumn({ secretKey: env.AUTUMN_SECRET_KEY })

type FeatureId = keyof typeof FEATURE_IDS

export const FEATURE_IDS = {
  transcription_seconds: "transcription_seconds",
} as const

export const FIVE_HOURS_IN_SECONDS = 18000 // 60 * 60 * 5

// Credits pack balance granted for new users
const FREE_CREDITS_PACK_BALANCE = 1800 // 30 minutes

const CREDITS_PACK_PLAN_ID = "credits_pack"

export const createCustomer = async ({ deviceId }: { deviceId: string }) => {
  const customer = await autumn.customers.getOrCreate({
    customerId: deviceId,
    fingerprint: deviceId,
    autoEnablePlanId: CREDITS_PACK_PLAN_ID,
  })
  return customer
}

export const checkCreditsPackBalance = async ({
  deviceId,
  requiredBalance = 1,
}: {
  deviceId: string
  requiredBalance?: number
}) => {
  const balance = await autumn.check({
    customerId: deviceId,
    featureId: FEATURE_IDS.transcription_seconds,
    requiredBalance,
  })
  return balance
}

export const consumeCreditsPack = async ({
  deviceId,
  balance,
}: {
  deviceId: string
  balance: number
}) => {
  const result = await autumn.track({
    customerId: deviceId,
    featureId: FEATURE_IDS.transcription_seconds,
    value: balance,
  })
  return result
}

/**
 * Check if customer's balance is from the free credits pack granted for new user
 */
export const isFreeCreditsPack = (balance: Balance) => {
  return balance.granted === FREE_CREDITS_PACK_BALANCE
}

export const addToBalance = async ({
  deviceId,
  featureId,
  balance,
}: {
  deviceId: string
  featureId: FeatureId
  balance: number
}) => {
  const updateBalance = await autumn.balances.update({
    customerId: deviceId,
    featureId,
    addToBalance: balance,
    // Set included grant to the purchased balance but let the overage from the balance remainder
    includedGrant: balance,
  })
  return updateBalance
}

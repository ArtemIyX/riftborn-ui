import {defineStore} from 'pinia'
import {ref, computed} from 'vue'

/**
 * Unreal Engine Server Configuration Store
 * Manages server connection settings and API endpoints
 */
export const useUnrealStore = defineStore('unreal', () => {
  // Server Configuration
  const Host = ref('localhost')
  const Port = ref(3000)
  const Protocol = ref('http') // 'http' or 'https'

  // Endpoints
  const Endpoints = ref({
    Image: '/image'
  })

  // Computed base URL
  const BaseUrl = computed(() => {
    return `${Protocol.value}://${Host.value}:${Port.value}`
  })

  /**
   * Build full URL for image endpoint with asset path
   * @param {string} InAssetPath - UE asset path (e.g., "Game/Images/Icon")
   * @returns {string} Full URL
   */
  const BuildImageUrl = (InAssetPath) => {
    // Normalize asset path (remove leading slash)
/*    let assetPath = InAssetPath.trim()
    if (assetPath.startsWith('/')) {
      assetPath = assetPath.substring(1)
    }*/

    // Build base URL
    const url = `${BaseUrl.value}${Endpoints.value.Image}`

    // Add query parameters if provided
    const params = new URLSearchParams();
    params.append("path", String(InAssetPath));

    const queryString = params.toString()
    return queryString ? `${url}?${queryString}` : url
  }

  /**
   * Set server host
   * @param {string} InHost - Server host (e.g., "localhost", "192.168.1.100")
   */
  const SetHost = (InHost) => {
    Host.value = InHost
  }

  /**
   * Set server port
   * @param {number} InPort - Server port (e.g., 8080)
   */
  const SetPort = (InPort) => {
    Port.value = InPort
  }

  /**
   * Set protocol
   * @param {string} InProtocol - Protocol ('http' or 'https')
   */
  const SetProtocol = (InProtocol) => {
    if (InProtocol === 'http' || InProtocol === 'https') {
      Protocol.value = InProtocol
    } else {
      console.error(`Invalid protocol: ${InProtocol}. Use 'http' or 'https'.`)
    }
  }

  /**
   * Set image endpoint path
   * @param {string} InEndpoint - Endpoint path (e.g., "/api/image")
   */
  const SetImageEndpoint = (InEndpoint) => {
    Endpoints.value.Image = InEndpoint
  }

  /**
   * Set full server configuration
   * @param {Object} InConfig - Configuration object
   */
  const SetConfig = (InConfig) => {
    if (InConfig.Host !== undefined) {
      Host.value = InConfig.Host
    }
    if (InConfig.Port !== undefined) {
      Port.value = InConfig.Port
    }
    if (InConfig.Protocol !== undefined) {
      SetProtocol(InConfig.Protocol)
    }
    if (InConfig.ImageEndpoint !== undefined) {
      Endpoints.value.Image = InConfig.ImageEndpoint
    }
  }

  /**
   * Reset to default configuration
   */
  const ResetConfig = () => {
    Host.value = 'localhost'
    Port.value = 3000
    Protocol.value = 'http'
    Endpoints.value.Image = '/image'
  }

  /**
   * Get current configuration
   * @returns {Object} Current configuration
   */
  const GetConfig = () => {
    return {
      Host: Host.value,
      Port: Port.value,
      Protocol: Protocol.value,
      BaseUrl: BaseUrl.value,
      ImageEndpoint: Endpoints.value.Image
    }
  }

  return {
    // State
    Host,
    Port,
    Protocol,
    Endpoints,

    // Computed
    BaseUrl,

    // Actions
    BuildImageUrl,
    SetHost,
    SetPort,
    SetProtocol,
    SetImageEndpoint,
    SetConfig,
    ResetConfig,
    GetConfig
  }
})

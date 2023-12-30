// @ts-check

class PeerService {
  peer: RTCPeerConnection | null = null;

  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }

  async getAnswer(
    offer: RTCSessionDescriptionInit
  ): Promise<RTCSessionDescriptionInit | undefined> {
    await this.peer?.setRemoteDescription(offer);
    const ans = await this.peer?.createAnswer();
    await this.peer?.setLocalDescription(ans);

    return ans;
  }
  async getOffer(): Promise<RTCSessionDescriptionInit | undefined> {
    const offer = await this.peer?.createOffer();
    await this.peer?.setLocalDescription(offer);
    return offer;
  }
}

export default new PeerService();

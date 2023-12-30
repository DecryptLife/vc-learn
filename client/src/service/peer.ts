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
    // fels like it might need new RTCSessionDescription
    if (this.peer) {
      try {
        await this.peer?.setRemoteDescription(offer);
        const ans = await this.peer?.createAnswer();
        await this.peer?.setLocalDescription(new RTCSessionDescription(ans));

        return ans;
      } catch (error) {
        console.error("Error creating offer ", error);
      }
    }

    return undefined;
  }

  async getOffer(): Promise<RTCSessionDescriptionInit | undefined> {
    const offer = await this.peer?.createOffer();
    await this.peer?.setLocalDescription(offer);
    return offer;
  }

  async setLocalDescription(ans: RTCSessionDescriptionInit) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  }
}

export default new PeerService();

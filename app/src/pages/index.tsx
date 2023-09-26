import { Inter } from "next/font/google";

import { DepositDeploymentAuthorization } from "@akashnetwork/akashjs/build/protobuf/akash/deployment/v1beta3/authz";
import { MsgDepositDeployment } from "@akashnetwork/akashjs/build/protobuf/akash/deployment/v1beta3/deploymentmsg";
import { getAkashTypeRegistry, getTypeUrl } from "@akashnetwork/akashjs/build/stargate/index";

import { Registry } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";

const inter = Inter({ subsets: ["latin"] });

declare global {
  interface Window {
    keplr: any;
  }
}

export default function Home() {
  return (
    <main className={`${inter.className}`}>
      <button
        onClick={async () => {
          if (!window.keplr) {
            alert("Please install keplr extension");
          } else {
            const chainId = "akashnet-2";
            await window.keplr.enable(chainId);
            const wallet = window.keplr.getOfflineSigner(chainId);
            console.log("wallet", wallet);
            const [account] = await wallet.getAccounts();
            console.log("account", account);
            const message = MsgDepositDeployment.fromPartial({
              id: {
                owner: "akash14utyn6v5t5xqh0eztaptzf2jm8juy0nzlgt96r",
                dseq: "12973474",
              },
              amount: {
                denom: "uakt",
                amount: "500",
              },
              depositor: "akash1mzctggcrjqpjqdlvus6skpdrq6jpylz6ruguru",
            });

            console.log("message", message);
            const msgAny = {
              typeUrl: getTypeUrl(MsgDepositDeployment),
              value: message,
            };
            console.log("msgAny", msgAny);
            const myRegistry = new Registry(getAkashTypeRegistry());
            console.log("myRegistry", myRegistry);
            const rpcEndpoint = "https://rpc.akashnet.net:443";
            const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, {
              registry: myRegistry as any,
            });
            console.log("client", client);
            const fee = {
              amount: [],
              gas: "100000",
            };
            const tx = await client.signAndBroadcast(account.address, [msgAny], fee);
            console.log("tx", tx);
          }
        }}
      >
        Add Fund
      </button>
      <button
        onClick={() => {
          const ms = DepositDeploymentAuthorization.fromPartial({});
          console.log(ms);
        }}
      >
        Delegate
      </button>
    </main>
  );
}

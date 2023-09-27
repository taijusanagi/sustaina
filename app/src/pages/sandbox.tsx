import { Inter } from "next/font/google";

import { MsgDepositDeployment } from "@akashnetwork/akashjs/build/protobuf/akash/deployment/v1beta3/deploymentmsg";
import {
  getAkashTypeRegistry,
  getTypeUrl,
} from "@akashnetwork/akashjs/build/stargate/index";

import { Registry } from "@cosmjs/proto-signing";
import { SigningArchwayClient, ArchwayClient } from "@archwayhq/arch3.js";
import { SigningStargateClient } from "@cosmjs/stargate";

const inter = Inter({ subsets: ["latin"] });

declare global {
  interface Window {
    keplr: any;
  }
}

export default function Home() {
  const akashDeployerOwner = "akash14utyn6v5t5xqh0eztaptzf2jm8juy0nzlgt96r";
  const akashDeployerDeseg = "12973474";
  const archwayContractAddress =
    "archway1tqfuly7tfcp7cfqfjq7nlv0xqhlpq3sjlcmgq2edxvky5r9k5qwq77lqkz";

  return (
    <main className={`${inter.className}`}>
      <button
        onClick={async () => {
          console.log("get reward");
          if (!window.keplr) {
            alert("Please install keplr extension");
            return;
          }
          const client = await ArchwayClient.connect(
            "https://rpc.mainnet.archway.io"
          );
          const msg = {
            get_count: {},
          };
          const { count } = await client.queryContractSmart(
            archwayContractAddress,
            msg
          );
          console.log("Counter: ", count);
          const contractMetadata = await client.getContractMetadata(
            archwayContractAddress
          );
          console.log("contractMetadata", contractMetadata);
          if (!contractMetadata || !contractMetadata.rewardsAddress) {
            return;
          }
          const reward = await client.getAllRewardsRecords(
            contractMetadata.rewardsAddress
          );
          console.log("reward", reward);
        }}
      >
        Get Reward
      </button>
      <button
        onClick={async () => {
          console.log("withdraw reward");
          if (!window.keplr) {
            alert("Please install keplr extension");
            return;
          }
          const chainId = "archway-1";
          await window.keplr.enable(chainId);
          const wallet = window.keplr.getOfflineSigner(chainId);
          const client = await SigningArchwayClient.connectWithSigner(
            "https://rpc.mainnet.archway.io",
            wallet
          );
          const [account] = await wallet.getAccounts();
          const fee = {
            amount: [],
            gas: "100000",
          };
          const tx = await client.withdrawContractRewards(
            account.address,
            0,
            fee
          );
          console.log("tx", tx);
        }}
      >
        Withdraw Reward
      </button>
      <button
        onClick={() => {
          console.log("withdraw reward");
          if (!window.keplr) {
            alert("Please install keplr extension");
            return;
          }
        }}
      >
        Convert Fund
      </button>
      <button
        onClick={async () => {
          console.log("add fund");
          if (!window.keplr) {
            alert("Please install keplr extension");
            return;
          }
          const chainId = "akashnet-2";
          await window.keplr.enable(chainId);
          const wallet = window.keplr.getOfflineSigner(chainId);
          console.log("wallet", wallet);
          const [account] = await wallet.getAccounts();
          console.log("account", account);
          if (account.address !== akashDeployerOwner) {
            alert("Please use akash deployer account:" + akashDeployerOwner);
            return;
          }
          const message = MsgDepositDeployment.fromPartial({
            id: {
              owner: akashDeployerOwner,
              dseq: akashDeployerDeseg,
            },
            amount: {
              denom: "uakt",
              amount: "500",
            },
            depositor: account.acount,
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
          const client = await SigningStargateClient.connectWithSigner(
            rpcEndpoint,
            wallet,
            {
              registry: myRegistry as any,
            }
          );
          console.log("client", client);
          const fee = {
            amount: [],
            gas: "100000",
          };
          // const tx = await client.signAndBroadcast(
          //   account.address,
          //   [msgAny],
          //   fee
          // );
          // console.log("tx", tx);
        }}
      >
        Add Fund
      </button>
    </main>
  );
}

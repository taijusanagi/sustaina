import { Inter } from "next/font/google";
import Head from "next/head";
import { useState } from "react";

import { MsgDepositDeployment } from "@akashnetwork/akashjs/build/protobuf/akash/deployment/v1beta3/deploymentmsg";
import {
  getAkashTypeRegistry,
  getTypeUrl,
} from "@akashnetwork/akashjs/build/stargate/index";

import { Registry } from "@cosmjs/proto-signing";
import { SigningArchwayClient, ArchwayClient } from "@archwayhq/arch3.js";
import { SigningStargateClient } from "@cosmjs/stargate";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [formMode, setFormMode] = useState<"input" | "dashboard">("input");
  const [akashDeploymentOwner, setAkashDeploymentOwner] = useState(
    "akash14utyn6v5t5xqh0eztaptzf2jm8juy0nzlgt96r"
  );
  const [akashDeploymentDesc, setAkashDeploymentDesc] = useState("12988011");
  const [archwayContractAddress, setArchwayContractAddress] = useState(
    "archway1tqfuly7tfcp7cfqfjq7nlv0xqhlpq3sjlcmgq2edxvky5r9k5qwq77lqkz"
  );
  const [archwayContractRewardAddress, setArchwayContractRewardAddress] =
    useState("");

  const [archwayReward, setArchwayReward] = useState("0");
  const [archwayWithdrawTx, setArchwayWithdrawTx] = useState("");
  const [fund, setFund] = useState("500");
  const [akashAddFundTx, setAkashAddFundTx] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");

  const getRewardAddressAndSet = async () => {
    const client = await ArchwayClient.connect(
      "https://rpc.mainnet.archway.io"
    );
    const contractMetadata = await client.getContractMetadata(
      archwayContractAddress
    );
    if (!contractMetadata || !contractMetadata.rewardsAddress) {
      throw new Error("Contact metadata is invalid");
    }
    setArchwayContractRewardAddress(contractMetadata.rewardsAddress);
  };

  const getReward = async () => {
    if (!archwayContractRewardAddress) {
      alert("Archway contract reward address is invalid");
      return;
    }
    const client = await ArchwayClient.connect(
      "https://rpc.mainnet.archway.io"
    );
    const reward = await client.getAllRewardsRecords(
      archwayContractRewardAddress
    );
    let amount = BigInt(0);
    reward.map((v) => {
      const [reward] = v.rewards;
      amount = amount + BigInt(reward.amount);
    });
    setArchwayReward(amount.toString());
  };

  const claimReward = async () => {
    if (!window.keplr) {
      alert("Please install keplr extension");
      return;
    }

    const chainId = "archway-1";
    await window.keplr.enable(chainId);
    const wallet = window.keplr.getOfflineSigner(chainId);
    const [account] = await wallet.getAccounts();
    if (account.address !== archwayContractRewardAddress) {
      alert(
        "Please use akash deployer account:" + archwayContractRewardAddress
      );
      return;
    }
    const client = await SigningArchwayClient.connectWithSigner(
      "https://rpc.mainnet.archway.io",
      wallet
    );
    const fee = {
      amount: [],
      gas: "100000",
    };
    const tx = await client.withdrawContractRewards(account.address, 0, fee);
    setArchwayWithdrawTx(tx.transactionHash);
  };

  const addFund = async () => {
    if (!window.keplr) {
      alert("Please install keplr extension");
      return;
    }
    const chainId = "akashnet-2";
    await window.keplr.enable(chainId);
    const wallet = window.keplr.getOfflineSigner(chainId);
    const [account] = await wallet.getAccounts();
    if (account.address !== akashDeploymentOwner) {
      alert("Please use akash deployer account:" + akashDeploymentOwner);
      return;
    }
    const message = MsgDepositDeployment.fromPartial({
      id: {
        owner: akashDeploymentOwner,
        dseq: akashDeploymentDesc,
      },
      amount: {
        denom: "uakt",
        amount: fund,
      },
      depositor: account.address,
    });
    const msgAny = {
      typeUrl: getTypeUrl(MsgDepositDeployment),
      value: message,
    };
    const myRegistry = new Registry(getAkashTypeRegistry());
    const rpcEndpoint = "https://rpc.akash.forbole.com:443";
    const client = await SigningStargateClient.connectWithSigner(
      rpcEndpoint,
      wallet,
      {
        registry: myRegistry as any,
      }
    );
    const fee = {
      amount: [],
      gas: "100000",
    };
    const tx = await client.signAndBroadcast(
      account.address,
      [msgAny],
      fee,
      archwayWithdrawTx || `ArchwayWithdrawTx: ${archwayWithdrawTx}`
    );
    setAkashAddFundTx(tx.transactionHash);
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-orange-300 to-orange-400 flex flex-col ${inter.className}`}
    >
      <Head>
        <title>Sustaina</title>
      </Head>

      {/* Header Section */}
      <div className="flex justify-end items-center p-4 mb-24"></div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center mb-12">
        <span className="text-7xl inline-block transform mb-2">🌿</span>

        <h1 className="text-white text-4xl font-bold mb-2">Sustaina</h1>
        <p className="text-white text-lg">
          Streamlining Akash and Archway Rewards!
        </p>
      </div>

      {/* Form Section */}
      <div className="flex items-center justify-center flex-grow mb-24 p-2">
        <div className="bg-white py-6 px-4 rounded-lg shadow-md max-w-lg w-full">
          <form className="space-y-4">
            {formMode === "input" && (
              <div>
                <label
                  htmlFor="AkashDeploymentOwner"
                  className="block text-sm font-medium text-gray-700"
                >
                  Akash Deployment Owner
                </label>
                <input
                  type="text"
                  id="AkashDeploymentOwner"
                  name="AkashDeploymentOwner"
                  value={akashDeploymentOwner}
                  onChange={(e) => setAkashDeploymentOwner(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md text-gray-700"
                  placeholder="Enter Akash Deployment Owner"
                />
                <label
                  htmlFor="akashDeploymentDeseg"
                  className="block text-sm font-medium text-gray-700 mt-4"
                >
                  Akash Deployment Deseg
                </label>
                <input
                  type="text"
                  id="akashDeploymentDeseg"
                  name="akashDeploymentDeseg"
                  value={akashDeploymentDesc}
                  onChange={(e) => setAkashDeploymentDesc(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md text-gray-700"
                  placeholder="Enter Akash Deployment Deseg"
                />
                <label
                  htmlFor="archwayContractAddress"
                  className="block text-sm font-medium text-gray-700 mt-4"
                >
                  Archway Contract Address
                </label>
                <input
                  type="text"
                  id="archwayContractAddress"
                  name="archwayContractAddress"
                  value={archwayContractAddress}
                  onChange={(e) => setArchwayContractAddress(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md text-gray-700"
                  placeholder="Enter Archway Contract Address"
                />
                <button
                  type="button"
                  onClick={async () => {
                    await getRewardAddressAndSet();
                    setFormMode("dashboard");
                  }}
                  className="mt-4 w-full px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                >
                  Go to Dashboard
                </button>
              </div>
            )}
            {formMode === "dashboard" && (
              <div>
                <div className="text-gray-700 break-all">
                  <label className="block text-sm font-medium text-gray-700">
                    Akash Deployment Owner
                  </label>
                  <p className="text-xs mt-1">{akashDeploymentOwner}</p>
                  <label className="block text-sm font-medium text-gray-700 mt-2">
                    Akash Deployment Desc
                  </label>
                  <p className="text-xs mt-1">{akashDeploymentDesc}</p>

                  <label className="block text-sm font-medium text-gray-700 mt-2">
                    Archway Contract Address
                  </label>
                  <p className="text-xs mt-1">{archwayContractAddress}</p>
                  <label className="block text-sm font-medium text-gray-700 mt-2">
                    Archway Contract Reward Address
                  </label>
                  <p className="text-xs mt-1">{archwayContractRewardAddress}</p>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Archway Reward
                  </label>
                  <div className="flex items-center justify-between">
                    <p className="text-xs mt-1"> {archwayReward} aarch</p>
                    <button
                      type="button"
                      className="px-3 py-1 border border-blue-300 text-blue-500 hover:bg-blue-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
                      onClick={getReward}
                    >
                      🔄 Refresh
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-4 w-full px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                  onClick={claimReward}
                >
                  Withdraw Reward in Archway
                </button>
                {archwayWithdrawTx && (
                  <div className="mt-4">
                    <label className="block font-medium">
                      Archway Withdraw Tx:
                    </label>
                    <p className="text-xs mt-1 break-all">
                      <a
                        href={`https://www.mintscan.io/archway/tx/${archwayWithdrawTx}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-green-500 hover:underline mt-4 text-center"
                      >
                        {archwayWithdrawTx}
                      </a>
                    </p>
                  </div>
                )}
                <a
                  href="https://app.osmosis.zone/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-green-500 mt-4 text-center border border-green-500 rounded-md px-3 py-2"
                >
                  Swap and Bridge
                </a>
                <label className="block text-sm font-medium text-gray-700 mt-4">
                  Fund Amount (uakt)
                </label>
                <input
                  type="number"
                  value={fund}
                  onChange={(e) => setFund(e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md text-gray-700"
                />
                <button
                  type="button"
                  className="mt-4 w-full px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                  onClick={addFund}
                >
                  Add Fund in Akash
                </button>
                {akashAddFundTx && (
                  <div className="mt-4">
                    <label className="block font-medium">Akash Fund Tx:</label>
                    <p className="text-xs mt-1 break-all">
                      <a
                        href={`https://www.mintscan.io/akash/tx/${akashAddFundTx}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-green-500 hover:underline mt-4 text-center"
                      >
                        {akashAddFundTx}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Modal Section */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative z-10 bg-white py-4 px-6 rounded-xl shadow-lg max-w-xl w-full mx-4">
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-700">Confirmation</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-2xl text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </header>
            <div className="space-y-4">{modalText}</div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useSyncProviders } from "@/hooks/useSyncProviders";
import { toast } from "sonner";
import { IconReload } from "@tabler/icons-react";
import axios from "axios";

const ADDRESS = "0x49e9511CD181a1cf086B2Ec2d5E4Cd7313b8997E"

const getCurrencyToEthRate = async (currency) => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${currency}`);
    return response.data.ethereum[currency.toLowerCase()];
  } catch (error) {
    console.error("Error fetching the exchange rate:", error);
    return null;
  }
};

const MetamaskForm = ({ amount, currency }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactionCompleted, setTransactionCompleted] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [userAccount, setUserAccount] = useState("");
  const [ethAmount, setEthAmount] = useState("");

  const providers = useSyncProviders();
  const metaMaskProvider = providers.find(
    (provider) => provider.info.name === "MetaMask"
  );

  useEffect(() => {
    const convertToEth = async () => {
      if (amount && currency) {
        const rate = await getCurrencyToEthRate(currency);
        if (rate) {
          const ethValue = (amount / rate).toFixed(6); // Convert the amount to ETH
          setEthAmount(ethValue);
        } else {
          setError("Failed to fetch exchange rate.");
        }
      }
    };

    convertToEth();
  }, [amount, currency]);

  const handleConnect = async (providerWithInfo) => {
    try {
      const accounts = (await providerWithInfo.provider.request({
        method: "eth_requestAccounts",
      }));
      setUserAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };


  async function errorHandler(error) {
    let message = "An unknown error occurred.";
    switch (error.code) {
      case 4001:
        message = "User rejected the request.";
        break;
      case -32002:
        message = "Transaction rejected by the network.";
        break;
      case -32602:
        message = "Invalid parameters provided.";
        break;
      case -32603:
        message = "Internal error occurred.";
        break;
      case 4100:
        message = "Account is locked.";
        break;
    }
    toast("Error: " + message);
  }

  const sendEth = async () => {
    const etherInput = document.getElementById("ether");
    const addrInput = document.getElementById("addr");

    const addr = addrInput?.value.trim();
    const ether = etherInput?.value.trim();

    if (!addr) {
      setError("Recipient Address cannot be empty");
      return;
    }
    if (!ether || isNaN(parseFloat(ether))) {
      setError("Amount in ETH must be a valid number");
      return;
    }

    const wei = `0x${Math.floor(parseFloat(ether) * 10 ** 18).toString(16)}`;

    try {
      setLoading(true);
      toast("Processing payment...");
      const txHash = (await metaMaskProvider?.provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: userAccount,
            to: addr,
            value: wei,
            gasLimit: "0x5028",
            maxPriorityFeePerGas: "0x3b9aca00",
            maxFeePerGas: "0x2540be400",
          },
        ],
      }));

      setTransactionHash(txHash);
      setTransactionCompleted(true);
      toast("Payment processed successfully!");
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer>
      {metaMaskProvider ? (
        <DrawerTrigger asChild>
          <Button
            className="m-3 bg-green-600 text-white hover:bg-green-700"
            onClick={() => handleConnect(metaMaskProvider)}
          >
            <span className="flex items-center gap-3">
              Connect to {metaMaskProvider.info.name}
              <img
                className="w-5 h-5"
                src={metaMaskProvider.info.icon}
                alt={metaMaskProvider.info.name}
              />
            </span>
          </Button>
        </DrawerTrigger>
      ) : (
        <div className="text-black">Please Install MetaMask extension</div>
      )}
      <h2 className="text-black">{userAccount ? "✅ Connected" : "❌ Not Connected"}</h2>
      <DrawerContent>
        {userAccount ? (
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Send a Transaction</DrawerTitle>
              <DrawerDescription>On the Sepolia Testnet</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="space-y-3">
                <Input
                  required
                  id="addr"
                  type="text"
                  placeholder="Recipient Address"
                  className="border-green-500 focus:border-green-600"
                  value={ADDRESS}
                  disabled
                />
                <Input
                  required
                  id="ether"
                  type="text"
                  placeholder="Amount in ETH"
                  className="border-green-500 focus:border-green-600"
                  value={ethAmount}
                  disabled
                />
              </div>
              {error && (
                <p className="mt-2 text-red-500 dark:text-red-400">{error}</p>
              )}
            </div>
            <DrawerFooter>
              <Button
                type="submit"
                variant="default"
                className="m-1 my-2 bg-green-600 text-white hover:bg-green-700"
                disabled={loading}
                onClick={sendEth}
              >
                {loading ? (
                  <>
                    <IconReload className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Pay now"
                )}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="m-1 my-2">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        ) : (
          <div>Please connect to a wallet to send a transaction</div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default MetamaskForm;
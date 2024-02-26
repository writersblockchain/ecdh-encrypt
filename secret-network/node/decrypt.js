import { SecretNetworkClient, Wallet } from "secretjs";
import dotenv from "dotenv";
dotenv.config({ path: "../../polygon/.env" });

const wallet = new Wallet(process.env.MNEMONIC);

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://lcd.pulsar-3.secretsaturn.net",
  wallet: wallet,
  walletAddress: wallet.address,
});

// secret contract info
let contractCodeHash = process.env.CODE_HASH;
let contractAddress = process.env.SECRET_ADDRESS;
let encrypted_data;
let other_public_key = process.env.ECC_PUBLIC_KEY.split(",").map((num) =>
  parseInt(num, 10)
);

const data =
  "0xe5370f62cb62d66e1b35c6f24031d1a12ec10142d97c2f51a6a66a37a0e3e21955cef8382534818f72f2ce9237b1bc359c5e67bfd1de956acc0f0d0801f06d5a8c0e84b9a1231988c163aa92ba85f656e87ec4";

function hexToArray(hexString) {
  // Check if the string starts with '0x' and remove it
  const hex = hexString.startsWith("0x") ? hexString.slice(2) : hexString;

  const numberArray = [];

  for (let i = 0; i < hex.length; i += 2) {
    numberArray.push(parseInt(hex.substr(i, 2), 16));
  }

  return numberArray;
}

let to_decrypt = hexToArray(data);

let get_decrypted_query = async () => {
  let query = await secretjs.query.compute.queryContract({
    contract_address: contractAddress,
    query: {
      decrypt_query: {
        public_key: other_public_key,
        encrypted_message: to_decrypt,
      },
    },
    code_hash: contractCodeHash,
  });

  console.log(query);
};

get_decrypted_query();

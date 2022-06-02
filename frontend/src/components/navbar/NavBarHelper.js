export const requestAccount = async () => {
  await window.ethereum.request({ method: "eth_requestAccounts" });
};

export const isConnected = async () => {
  let connectionStatus = await window.ethereum.isConnected();
  return connectionStatus;
};

import axiosClient from '../axios';

export const getWallet = async (): Promise<{ balance: number; currency: string }> => {
	const res = await axiosClient.get('/customer/wallet');
	return res.data;
};

export const topUp = async (data: { amount: number; method: string }) => {
	const res = await axiosClient.post('/customer/wallet/topup', data);
	return res.data;
};

export const addPaymentMethod = async (data: any) => {
	const res = await axiosClient.post('/customer/wallet/methods', data);
	return res.data;
};

export const removePaymentMethod = async (id: string) => {
	const res = await axiosClient.delete(`/customer/wallet/methods/${id}`);
	return res.data;
};

export const getWalletTransactions = async (): Promise<any[]> => {
	const res = await axiosClient.get('/customer/wallet/transactions');
	return res.data.transactions ?? res.data;
};


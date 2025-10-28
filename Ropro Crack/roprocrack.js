// Disclaimer: This is only for entertainment and educational purposes.  
// I’m not responsible for what you do with it or any consequences.  
// Made by VN :3

async function fetchSubscription() {
	return new Promise(async (resolve) => {
		resolve("pro_tier"); // Change to whatever tier you would like.
	});
}

var subscriptionPromise = [];

async function getSubscription() {
	if (subscriptionPromise.length === 0) {
		subscriptionPromise.push(
			new Promise(async (resolve) => {
				const freshness = await getLocalStorage("rpSubscriptionFreshness");
				if (!freshness || Date.now() >= freshness + 300 * 1000) {
					try {
						await validateUser();
						const subscription = await fetchSubscription();
						setLocalStorage("rpSubscription", subscription);
						setLocalStorage("rpSubscriptionFreshness", Date.now());
						resolve(subscription);
					} catch (e) {
						console.log("Error fetching subscription: ", e);
						setLocalStorage("rpSubscriptionFreshness", Date.now());
						resolve(null);
					}
				} else {
					resolve(await getLocalStorage("rpSubscription"));
				}
			})
		);
	}

	const myPromise = await subscriptionPromise[0];
	subscriptionPromise = [];
	return myPromise;
}
getSubscription();

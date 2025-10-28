import { Amplify } from 'aws-amplify';

// Only configure if we have the required environment variables
const getAmplifyConfig = () => {
  const region = process.env.NEXT_PUBLIC_AWS_REGION;
  const userPoolId = process.env.NEXT_PUBLIC_AWS_USER_POOL_ID;
  const userPoolClientId = process.env.NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID;

  // Return null if required config is missing
  if (!region || !userPoolId || !userPoolClientId) {
    console.warn('AWS Cognito configuration is incomplete. Please check your environment variables.');
    return null;
  }

  return {
    Auth: {
      Cognito: {
        region,
        userPoolId,
        userPoolClientId,
        loginWith: {
          email: true,
          username: true,
          phone: false,
        },
      },
    },
  };
};

export const configureAmplify = () => {
  try {
    const config = getAmplifyConfig();
    if (config) {
      Amplify.configure(config);
      console.log('AWS Amplify configured successfully');
      return true;
    } else {
      console.warn('AWS Amplify configuration skipped - missing environment variables');
      return false;
    }
  } catch (error) {
    console.error('Error configuring AWS Amplify:', error);
    return false;
  }
};

export default getAmplifyConfig;

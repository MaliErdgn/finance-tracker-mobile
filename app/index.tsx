import { useRootNavigationState, Redirect } from 'expo-router';

export default function InitialRouting() {
  const rootNavigationState = useRootNavigationState();

  // Check if the navigation state is ready, if not return null
  if (!rootNavigationState?.key) return null;

  // Redirect to the desired route, e.g., dashboard or tab layout
  return <Redirect href={'/(tabs)/dashboard'} />;
}

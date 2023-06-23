const mapping: Record<string, string> = {
  providers: 'provider',
  simulations: 'simulation',
  'simulation-results': 'simulation_result',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}

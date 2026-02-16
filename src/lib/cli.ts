/**
 * CLI Output Parser
 * Extracts JSON from CLI output that might contain non-JSON prefix text.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseCliOutput(output: string): any {
  try {
    return JSON.parse(output);
  } catch {
    // Try to find the start of a JSON object or array
    const jsonStart = output.search(/[{[]/);
    if (jsonStart !== -1) {
      const jsonStr = output.slice(jsonStart);
      try {
        return JSON.parse(jsonStr);
      } catch {
        throw new Error('Failed to parse extracted JSON from CLI output');
      }
    }
    throw new Error('No JSON found in CLI output');
  }
}

/** Sentinel used by the model filter to mean "show everything". */
export const ALL_MODELS = "__all__";

/** Synthetic model dimension for web tool charges (function_call rows). */
export const WEB_TOOLS_MODEL = "__web_tools__";

/** True when a DailyUsage row belongs to the synthetic web-tool dimension. */
export function isWebToolModel(model: string): boolean {
  return model === WEB_TOOLS_MODEL;
}

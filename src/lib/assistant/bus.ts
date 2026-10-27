/** Open the site assistant from anywhere (hero, Topsoil, terminal), optionally with a question. */
export const ASK_EVENT = 'strata:ask'

export function askAssistant(question?: string) {
  window.dispatchEvent(new CustomEvent<string | undefined>(ASK_EVENT, { detail: question }))
}

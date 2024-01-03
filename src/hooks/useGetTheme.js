import { Theme } from "../realm/Schema";
import { RealmContext } from "../realm/RealmWrapper";

export const useGetTheme = () => {
  const { useQuery } = RealmContext
  const theme = useQuery(Theme)
  if(theme) {
    return { themeFromRealm: theme[0] } 
  }

  return null
}
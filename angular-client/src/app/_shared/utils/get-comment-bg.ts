export function compareToGetClass(loggedInUsername: string, authorUsername: string): string {
  let currentClasses = "comment__box";
  if (loggedInUsername === authorUsername) currentClasses += ' self';
  return currentClasses;
}
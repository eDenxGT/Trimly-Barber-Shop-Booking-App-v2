export interface IHairstyleEntity {
  hairstyleId: string;
  name: string;
  image: string;
  gender: "male" | "female";
  faceShapes: string[];
}

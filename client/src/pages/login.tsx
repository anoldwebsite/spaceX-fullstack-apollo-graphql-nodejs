import React from "react";
import { useApolloClient, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { LoginForm, Loading } from "../components";
import ApolloClient from "apollo-client";
import * as LoginTypes from "./__generated__/login";

export const LOGIN_USER = gql`
  mutation login($email: String!) {
    login(email: $email)
  }
`;

export default function Login() {
  const client: ApolloClient<any> = useApolloClient();
  const [login, { loading, error }] = useMutation<
    LoginTypes.login,
    LoginTypes.loginVariables
  >(LOGIN_USER, {
    onCompleted({ login }) {
      //callback takes login function returned by useMutation as argument.
      localStorage.setItem("token", login as string); //Storing the user's token in the local storage.
      client.writeData({ data: { isLoggedIn: true } }); //Directly writing to the cache to show the login status of user.
    },
  });

  if (loading) return <Loading />;
  if (error) return <p>An error occured!</p>;

  return <LoginForm login={login} />;
}

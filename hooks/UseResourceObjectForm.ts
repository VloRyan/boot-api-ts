import { ResourceObjectForm } from "ts-jsonapi-form/form/";
import {
  ResourceObject,
  SingleResourceDoc,
} from "ts-jsonapi-form/jsonapi/model/";
import type { QueryKey } from "@tanstack/query-core";
import { useQueryClient } from "@tanstack/react-query";
import { useAlertSubmitResponseHandler } from "./";

export interface SubmitResponseHandler {
  onSubmitSuccess: (object: ResourceObject) => void;
  onSubmitError: (error: Error) => void;
}
export interface useResourceObjectFormProps {
  document: SingleResourceDoc | null;
  id?: string;
  onSubmit?: (object: ResourceObject) => void;
  queryKey?: QueryKey;
  submitResponseHandler?: SubmitResponseHandler;
  apiUrl?: string;
}

export const useResourceObjectForm = (props: useResourceObjectFormProps) => {
  const queryClient = useQueryClient();
  const defaultSubmitResponseHandler = useAlertSubmitResponseHandler();
  return new ResourceObjectForm({
    ...props,
    onSubmitSuccess: (obj: ResourceObject) => {
      if (props.queryKey) {
        queryClient!
          .invalidateQueries({
            queryKey: props.queryKey,
          })
          .then();
      }
      if (props.submitResponseHandler) {
        props.submitResponseHandler.onSubmitSuccess(obj);
      } else {
        defaultSubmitResponseHandler.onSubmitSuccess(obj);
      }
    },
    onSubmitError: (err: Error) => {
      if (props.submitResponseHandler) {
        props.submitResponseHandler.onSubmitError(err);
      } else {
        defaultSubmitResponseHandler.onSubmitError(err);
      }
    },
  });
};

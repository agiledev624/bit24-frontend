import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Subject, Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { requestLoginAction, USER_AUTHORIZED } from "@/actions/auth.actions";
import { renderRoutes } from "react-router-config";
import { useUnmount$ } from "@/exports/streams/hooks/use-unmount";

export const Login = ({ route }) => {
  const unmount$ = useUnmount$();
  const [error, setError] = useState();
  const dispatch = useDispatch();

  return (
    <div>
      <Formik
        initialValues={{ email: "test@gmail.com", password: "123456" }}
        validate={(values) => {
          const errors: any = {};
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }

          if (!values.password) {
            errors.password = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          requestLoginAction({
            email: values.email,
            password: values.password,
            fallback: (error) => {
              setError(error.errorMessage);
              setSubmitting(false);
            },
          })
            .pipe(takeUntil(unmount$))
            .subscribe((res) => {
              console.log(">>>> res", res);
              dispatch({
                type: USER_AUTHORIZED,
                payload: res.data,
              });
            });

          // setTimeout(() => {
          //   alert(JSON.stringify(values, null, 2));
          //   setSubmitting(false);
          // }, 2000);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <Field type="email" name="email" className="test-s" />
            <ErrorMessage name="email" component="div" />
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" />
            <button type="submit" disabled={isSubmitting}>
              Submit ...{`${isSubmitting}`}
            </button>
          </Form>
        )}
      </Formik>

      {renderRoutes(route.routes)}
    </div>
  );
};

export default Login;

import React, { Children, useEffect, useMemo } from 'react';

import { isFunction } from 'lodash';

import { toForm } from 'src/core/to-form';
import { FormControl, FormOptions, FormRenderProps } from '../types/form';
import { createForm } from '../core/create-form';
import { FormModelContext } from './context';

export type FormProps<TValues> = FormOptions & {
  /**
   * React children or child render propxxx
   */
  children?: ((props: FormRenderProps<TValues>) => React.ReactNode) | React.ReactNode;

  /**
   * If this prop is set to true, Form instance will be kept event thought<Form /> is destroyed.
   * This means you can still use some form's api such as Form.validate and Form.setValueIn to handle pure data logic.
   * @default false
   */
  keepModelOnUnMount?: boolean;

  /**
   * provide form instance from outside. if control is given Form will use the form instance in the control instead of creating one.
   */
  control?: FormControl<TValues>;
};

/**
 * Hoc That init and provide Form instance. You can also provide form instance from outside by using control prop
 * @param props
 */
export function Form<TValues>(props: FormProps<TValues>) {
  const { children, keepModelOnUnMount = false, control, ...restOptions } = props;
  const { _formModel: formModel } = useMemo(
    () => (control ? control : createForm(restOptions).control),
    [control]
  );

  useEffect(
    () => () => {
      // 组件销毁时，销毁formModel
      if (!keepModelOnUnMount) {
        formModel.dispose();
      }
    },
    []
  );

  const form = useMemo(() => toForm<TValues>(formModel), [formModel]);

  return (
    <FormModelContext.Provider value={formModel}>
      {children ? (isFunction(children) ? children({ form }) : Children.only(children)) : null}
    </FormModelContext.Provider>
  );
}

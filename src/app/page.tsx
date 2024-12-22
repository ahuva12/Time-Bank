"use client";

import { redirect } from 'next/navigation';

export default function Home() {

  // Redirect to /home
  redirect('/home');

  return null; // Render nothing as we are redirecting
}

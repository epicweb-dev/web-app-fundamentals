import type * as P from '@prisma/client'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcryptjs'
import { type PrismaClient } from '@prisma/client'
import { memoizeUnique } from 'tests/memoize-unique.ts'

const unique = memoizeUnique(faker.internet.userName)

export async function downloadFile(
	url: string,
	retries: number = 0,
): Promise<Buffer> {
	const MAX_RETRIES = 3
	try {
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`Failed to fetch image with status ${response.status}`)
		}
		const blob = Buffer.from(await response.arrayBuffer())
		return blob
	} catch (e) {
		if (retries > MAX_RETRIES) throw e
		return downloadFile(url, retries + 1)
	}
}

export function createContactInfo(): Omit<
	P.ContactInfo,
	'id' | 'userId' | 'createdAt' | 'updatedAt'
> {
	return {
		address: faker.location.streetAddress(),
		city: faker.location.city(),
		state: faker.location.state(),
		zip: faker.location.zipCode(),
		country: faker.location.country(),
		phone: faker.phone.number(),
	}
}

export function createUser({
	gender = faker.helpers.arrayElement(['female', 'male']) as 'female' | 'male',
}: {
	gender?: 'male' | 'female'
} = {}): Omit<P.User, 'id' | 'createdAt' | 'updatedAt' | 'imageId'> {
	const firstName = faker.person.firstName(gender)
	const lastName = faker.person.lastName()

	const username = unique({
		firstName: firstName.toLowerCase(),
		lastName: lastName.toLowerCase(),
	})
	return {
		username,
		name: `${firstName} ${lastName}`,
		email: `${username}@example.com`,
	}
}

export const oneDay = 1000 * 60 * 60 * 24
export function createDateRange({
	start,
	end,
	maxDays,
}: {
	start: Date
	end: Date
	maxDays: number
}) {
	const randomStart = faker.date.between({
		from: start,
		to: end.getTime() - oneDay * 2,
	})
	const endStartRange = randomStart.getTime() + oneDay
	const endEndRange = Math.min(endStartRange + oneDay * maxDays, end.getTime())
	return {
		startDate: randomStart,
		endDate: faker.date.between({ from: endStartRange, to: endEndRange }),
	}
}

export const lockifyFakerImage = (imageUrl: string) =>
	imageUrl.replace(/\?(\d+)/, '?lock=$1')

export function createBrand() {
	return {
		name: faker.company.name(),
		description: faker.company.buzzPhrase(),
	}
}

export function createShipModel() {
	return {
		name: faker.company.name(),
		description: faker.company.buzzPhrase(),
	}
}

export function createStarport() {
	return {
		name: faker.company.name(),
		description: faker.lorem.sentences(3),
		latitude: Number(faker.location.latitude()),
		longitude: Number(faker.location.longitude()),
	}
}

export function createPassword(username: string = faker.internet.userName()) {
	return {
		hash: bcrypt.hashSync(username, 10),
	}
}

export function createShip() {
	return {
		name: faker.lorem.word(),
		capacity: faker.number.int({ min: 1, max: 10 }),
		description: faker.lorem.sentences(3),
		dailyCharge: faker.number.int({ min: 100, max: 1000 }),
	}
}

export function createBooking({
	start,
	end,
	dailyCharge,
}: {
	start: Date
	end: Date
	dailyCharge: number
}) {
	const { startDate, endDate } = createDateRange({
		start,
		end,
		maxDays: 10,
	})
	const days = Math.ceil((endDate.getTime() - startDate.getTime()) / oneDay)

	const createdAt = faker.date.between({
		from: startDate.getTime() - oneDay * 10,
		to: startDate.getTime() - oneDay,
	})
	return {
		createdAt,
		updatedAt: createdAt,
		startDate,
		endDate,
		totalPrice: days * dailyCharge,
	}
}

export async function insertImage(prisma: PrismaClient, imageUrl: string) {
	const image = await prisma.image.create({
		data: {
			contentType: 'image/jpeg',
			file: {
				create: {
					blob: await downloadFile(lockifyFakerImage(imageUrl)),
				},
			},
		},
		select: { fileId: true },
	})
	return image.fileId
}
